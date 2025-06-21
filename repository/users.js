const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository {
    constructor (fileName) {
        if (!fileName) {
            throw new Error('File name is required to create a user');
        }

        this.fileName = fileName;

        try {
            fs.accessSync(fileName);
        } catch (e) {
            fs.writeFileSync(fileName, '[]');
        }
    }

    async getAll (){
        const rawContent = await fs.promises.readFile(this.fileName, { encoding: 'utf8' });

        if (!rawContent.trim()) {
            return [];
        }
        try {
            return JSON.parse(rawContent);
        } catch (err) {
            console.error(`Error in JSON parse ${err}`);
            return [];
        }
    }

    async writeAll(records) {
        return await fs.promises.writeFile(this.fileName, JSON.stringify(records, null, 2));
    }

    async create(attrs) {
        attrs.id = this.randomId();
        const password = attrs.password;
        const salt = crypto.randomBytes(16).toString('hex');
        const buffer = await scrypt(password, salt, 64);
        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buffer.toString('hex')}.${salt}`
        };
        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async comparePasswords(saved, served) {
        if (!saved ||  typeof saved !== 'string' || !saved.includes('.')) {
            throw new Error('Invalid saved password format');
        }
        if (!served || typeof served !== 'string') {
            throw new Error('Invalid served password');
        }
        const [hashedPassword, salt] = saved.split('.');
        const servedBuffer = await scrypt(served, salt, 64);
        const servedHashed = servedBuffer.toString('hex');

        if (hashedPassword !== servedHashed) {
            console.log("Passwords don't match");
            return false;
        }
        return true;
    }

    randomId() {
        return crypto.randomBytes(8).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id)
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id  !== id);
        await this.writeAll(filteredRecords);
    }

    async getOneBy(filters) {
        const records = await this.getAll();
        for (let record of records) {
            if (!record) {
                throw new Error('No users found');
            }
            let keyFound = true;
            for (let filter in filters) {
                if (filters[filter] !== record[filter]) {
                    keyFound = false;
                }
            }
            if (keyFound) {
                return record;
            }
        }
    }

    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if (!record) {
            throw new Error('No users found');
        }

        Object.assign(record, attrs);
        await this.writeAll(records);
    }
}

module.exports = new UsersRepository('users.json');

// const test = async () => {
//     const repository = new UsersRepository('users.json');
//     // await repository.create({username: 'example2', password: 'password'});
//
//     // const user = await repository.create({username: 'example1', password: 'password'});
//     // const user = await repository.delete("70c6aaf76ccfe997");
//     // const user = await repository.getOneBy({username: 'asdfgh', password: 'qwerty'});
//     // const user = await repository.update('c59b941aeb64d765', {username: 'qwerty'});
//     // const user = await repository.comparePasswords("4fd370b7f6e78bac48d13e27f3140200357088e3b03a172dde7dd032ebd9f3443f04954f38520cf18cb7a91ba8593ecfe68c2be11a0968219ae40da6fe5efcd6.7cb859c0199e2c8f22c6b22b042155cc", "password");
//     // console.log(user);
//     // console.log(repository.randomId());
//     // console.log(repository.getOne("94c4c1e842757314"));
// }
//
// test();
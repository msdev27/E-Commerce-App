const fs = require('fs');
const crypto = require('crypto');

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
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
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
            return record;
        }
    }
}

module.exports = new UsersRepository('users.json');

// const test = async () => {
//     const repository = new UsersRepository('users.json');
//     await repository.create({username: 'someone', password: 'somePassword'});
//     // const user = await repository.delete("70c6aaf76ccfe997");
//     const user = await repository.getOneBy({username: 'someone', password: 'somePassword'});
//     console.log(user);
//     // console.log(repository.randomId());
//     // console.log(repository.findById("94c4c1e842757314"));
// }

// test();
const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');
const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
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
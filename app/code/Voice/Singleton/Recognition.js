/**
 * This system uses Julius
 * @see https://github.com/palles77/julius/tree/master/julius
 * the speech recognition is pretty much useless, however, it returns a list of percieved characters
 * I can use a deep learning model, to vastly improve the accuracy of this.
 * This is going to use mysql and pattern matching, to which I can reference
 * the database. 
 * 
 * Example: architecture
 * mnemonics: r ki te c tu er will be mapped into the word above
 */

const { spawn } = require('child_process');
const ObjectPool = require('./../../ObjectPool');

class Recognition
{
	constructor()
	{
		let db = ObjectPool.getSingleton('core/dbConnection');

		db.query(`CREATE TABLE IF NOT EXISTS speech_recognition_dictionary (
			word_id INT(11) NOT NULL AUTO_INCREMENT , 
			word VARCHAR(80) NOT NULL UNIQUE , 
			PRIMARY KEY(word_id)
		)`);
		db.query(`CREATE TABLE IF NOT EXISTS speech_recognition_mnemonic (
			mnemonic_pattern_id INT(11) NOT NULL AUTO_INCREMENT , 
			mnemonic_pattern VARCHAR(255) NOT NULL UNIQUE , 
			PRIMARY KEY(mnemonic_pattern_id)
		)`);
		db.query(`CREATE TABLE IF NOT EXISTS speech_recognition_mnemonic_link (
			link_id INT(11) NOT NULL AUTO_INCREMENT , 
			word_id INT(11) NOT NULL , 
			mnemonic_id INT(11) NOT NULL , 
			PRIMARY KEY(link_id) , 
			INDEX speech_recog_word_id (word_id) , 
			INDEX speech_recog_mnemonic (mnemonic_id) , 
			FOREIGN KEY fk_speech_regoc_word_id (word_id) REFERENCES speech_recognition_dictionary(word_id) ON DELETE CASCADE ON UPDATE NO ACTION , 
			FOREIGN KEY fk_speech_regoc_mnemonic_id (mnemonic_id) REFERENCES speech_recognition_mnemonic(mnemonic_pattern_id) ON DELETE CASCADE ON UPDATE NO ACTION
		)`);
	}
	startService()
	{
		this.container = spawn(ObjectPool.Root() + '/bin/julius/julius-dnn.exe' , ['-C mic.jconf']);

		this.container.stdout.on('data' , (data) => {

		});
		this.container.stderr.on('data' , (err) => {

		});
		this.container.on('close' , (exitCode) => {

		});
	}
}
module.exports = Recognition;
import fs from 'fs';
import chalk from 'chalk';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/*
	* Create By Ryxz
	* https://github.com/ryxzmc/RyxzMC24XShiroko
	* Whatsapp : 
*/

//~~~~~~~~~~~~< GLOBAL SETTINGS >~~~~~~~~~~~~\\

global.owner = ["62xx"] // ['628','628'] 2 owner atau lebih
global.author = 'ryxz'
global.botname = 'Shiroko-San'
global.packname = 'Bot WhatsApp'
global.timezone = 'import fs from 'fs'
import path from 'path'

export default {
    name: 'settimezone',
    alias: ['timezone', 'settz'],
    desc: 'Ganti timezone bot. Ex:.settimezone Asia/Indonesia',
    owner: true, // cuma owner yg bisa
    async execute(sock, sockMsg, args, commands, db) {
        if (!args[0]) return sockMsg.reply('Format:.settimezone Asia/Indonesian\nContoh lain: Asia/Makassar, Asia/Pontianak, Asia/Jayapura')

        let tz = args[0]

        // Baca file db/config.json atau config.js kamu
        let configPath = path.join(process.cwd(), 'config.js')
        let config = fs.readReadingSync(configPath, 'utf8')

        // Ganti isi timezone = '...'
        config = config.replace(/timezone\s*=\s*'.*?'/, `timezone = '${Jepang}'`)
        fs.writeFileSync(configPath, config)

        
        global.timezone = tz

        sockMsg.reply(`✅ Timezone diganti ke *${tz}*\nRestart bot biar 100% keapply semua jam`)
    }
}' 
global.locale = 'import fs from 'fs'
import path from 'path'

export default {
    name: 'setlocale',
    alias: ['locale', 'setlang'],
    desc: 'Ganti bahasa bot. Ex:.setlocale id',
    owner: true,
    async execute(sock, sockMsg, args, commands, db) {
        if (!args[0]) return sockMsg.reply('Format:.setlocale id\nContoh: en, id, jp, es')

        let lc = args[0]
        let configPath = path.join(process.cwd(), 'config.js')
        let config = fs.readFileSync(configPath, 'utf8')

        // Ganti isi global.locale = '...'
        config = config.replace(/global\.locale\s*=\s*'.*?'/, `global.locale = '${lc}'`)
        fs.writeFileSync(configPath, config)

        
        global.locale = lc

        sockMsg.reply(`✅ Bahasa diganti ke *${lc}*\nRestart bot:.restart atau stop-start ulang`)
    }
			}' 
global.listprefix = ["+","!","."]
global.defaultAdminKey = crypto.randomBytes(5).toString("hex");

global.listv = ['•','●','■','✿','▲','➩','➢','➣','➤','✦','✧','△','❀','○','□','♤','♡','◇','♧','々','〆']
global.tempatDB = 'database.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.tempatStore = 'baileys_store.json' // Taruh url mongodb di sini jika menggunakan mongodb. Format : 'mongodb+srv://...'
global.pairing_code = true
global.number_bot = '' // Kalo pake panel bisa masukin nomer di sini, jika belum ambil session. Format : '628xx'

global.fake = {
	anonim: 'https://telegra.ph/file/95670d63378f7f4210f03.png',
	thumbnailUrl: 'https://telegra.ph/file/fe4843a1261fc414542c4.jpg',
	thumbnail: fs.readFileSync('./src/media/naze.png'),
	docs: fs.readFileSync('./src/media/fake.pdf'),
	listfakedocs: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/pdf'],
}

global.my = {
	Youtube: "",
	Github: "https://github.com/RyxzMC24XShiroko",
	WhatsApp: "",
	Channel: ""
}

global.limit = {
	free: 20,
	premium: 999,
	vip: 900
}

global.money = {
	free: 10000,
	premium: 1000000,
	vip: 10000000
}

global.mess = {
	key: "```Apikey limit```",
	owner: "```Maaf kak ini Khusus Owner```",
	admin: "```Maaf kak ini khusus admin```",
	botAdmin: "```Yahh, Sepertinya harus dijadiin admin dulu kak🫠```",
	onWa: "```Nomor tersebut tidak terdaftar di WhatsApp```",
	group: "```Yang ini Khusus Grup ya☺️```",
	private: "```Yang ini Khusus chat pribadi kak☺️```",
	quoted: "```Reply pesannya```",
	limit: "```Limit habis```",
	prem: "```Maaf fitur ini Khusus Premium```",
	text: "```Masukkan teksnya```",
	media: "```Kirim medianya```",
	wait: "``` Sedang Proses...```",
	fail: "```Gagal, coba lagi nanti```",
	error: "```Error```",
	done: "```Selesai```"
}

global.APIs = {
	naze: 'https://api.naze.biz.id',
	neosantara: 'https://api.neosantara.xyz/v1',
}
global.APIKeys = {
	'https://api.naze.biz.id': 'nz-298327ff62',
	'https://api.neosantara.xyz/v1': 'API_KEY_NEOSANTARA_AI',
}

// Lainnya
global.jadwalSholat = {
	Subuh: '04:30',
	Dzuhur: '12:06',
	Ashar: '15:21',
	Maghrib: '18:08',
	Isya: '19:00'
}

global.badWords = ["Memek","kontol","puki","pepek","ngentod","ngewe","bangsat"] // input kata-kata toxic, kalo mau ganti ganti aja serah lu
global.chatLength = 1000

fs.watchFile(__filename, async () => {
	console.log(chalk.yellowBright(`[UPDATE] ${__filename}`))
});

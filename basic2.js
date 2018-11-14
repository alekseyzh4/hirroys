const { VK }        = require("vk-io");
const vk            = new VK();
const { updates }   = vk;
const fs            = require("fs");
// Массив с админами
const admins        = [401970788,481129774,309253224];
// Наша крутая база юзеров
const users         = require("./users.json");
const moment        = require("moment");
var top = 0;
var car;
var phone;
var home;
var promo = 0
promo = 0
home = 'нету'
phone = 'нету'
car = 'нету'
vk.setOptions({ 
token: "234dae5c585f0b928098376cd0566c6484114117366f0b5bc9207a2bb3395a26f1407cc460b502fa7bb41", 
apiMode: "parallel", 
pollingGroupId: 172058080
});
setInterval(() => {
let users = require('./users.json');
require('fs').writeFileSync('./users.json', JSON.stringify(users, null, '\t'));
}, 2000);
fs.readFile('example_log.txt', function (err, logData) {});
updates.use(async (context, next) => {
    if (context.is("message") && context.isOutbox)
        return;

    // Проверка на наличие текста
    if (context.text) {
        // Элементарный лог, @id -- айди пользователя, #id -- айди чата (если сообщение из чата)
        console.log(`@id${context.senderId} ${ context.isChat ? "#" + context.chatId : "" }, text: ${ context.text.slice(0, 36) }`);
    }
    // Проверка существует ли пользователь в базе, если нет - создаем
if (!users[context.senderId]) {
const info = await vk.api.users.get({user_ids: context.senderId})
users[context.senderId] = {
permission: 0,
balance: 1000,
top: 0,
buy: 0,
ban: false,
nickname: `${info[0].first_name} ${info[0].last_name}` ,
home: `нету`,
phone: `нету`,
car: `нету`,
		"shop": 22400,
		"res": 0,
		"job1": 0,
		"job": 0,
		"warn":0,
            bonus: null

role:`Обычный игрок`		


};
    }
    // Передаем инфу о юзере в context, для удобства
    context.user = users[context.senderId];
    // Проверка на наличие блокировки у пользователя, если есть то игнор
    if (context.user.ban) return;

    try {
	context.user.top += 1	
        await next();
    } catch (err) { console.error(err) }
});
updates.hear(/^!трейд ([0-9]+) ([0-9]+)/i, async (context) => {
const amount = context.$match[1]
const user = context.$match[2]
if(amount > context.user.balance) return await context.send('Недостаточно средств!')
if(!users[user]) return await context.send('Пользователь не найден!')
context.user.balance -= Number(amount)
users[user].balance += Number(amount)
 await context.send(`@id${context.senderId}(${context.user.nickname}) отправил @id${user}(${users[user].nickname}) ${amount} монет \n чек перевода:  ${ getRandomInt(4575678785) }`)
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `@id${context.senderId}(${context.user.nickname}) отправил вам ${amount} монет`}) 
}, 10)
});



updates.hear(/^!левел ([0-9]+) ([0-9]+)/i, async (context) => {
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);	
const user = context.$match[1]
const amount = context.$match[2]
if(!users[user]) return await context.send('Пользователь не найден!')
users[user].permission = Number(amount)
 await context.send(`@id${context.senderId}(${context.user.nickname}) выдал @id${user}(${users[user].nickname}) permission {amount}`)
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `@id${context.senderId}(${context.user.nickname}) выдал вам permission: ${amount} `}) 
}, 10)
});
updates.hear(/^!промо чистка/i, async (context) => {
promo = 0
return await context.send(`Промокоды снова могут использовать 5 людей`)
});

updates.hear(/^!рефка ([0-9]+)/i, async (context) => {
if(0 < context.user.job) return await context.send('Вы не можете стать рефералом!')	
const user = context.$match[1]
if(!users[user]) return await context.send('Пользователь не найден!')
users[user].res += 1
context.user.balance += 5000
context.user.job += 1
context.user.job1=`(${users[user].nickname})`
return await context.send(`  @id${user}(${users[user].nickname}) был приглашен @id${context.senderId}(${context.user.nickname}) `)
});

updates.hear(/^!промо ХИРО-1234/i, async (context) => {
if(promo > 5) return await context.send('Этот промокод более не актуален!')	
if(context.user.buy > 0) return await context.send('Вы уже вводили этот промокод!')		

context.user.balance += 7000
promo += 1
context.user.buy += 1
return await context.send(` Вы использовали промокод! `)
});

updates.hear(/!промо сброс/i, async (context) => {
    if(context.user.permission < 5) return
    for(key in users) {
        users[key].buy = 0
    }
	promo = 0
    return context.send('готово')
})



updates.hear(/(?:!-report|!ответить) ([0-9]+) (.*)/i, async (context) => {
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);
const user = context.$match[1]

    await context.send('Ответ отправлен!')
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `Администрация ответила на ваш репорт:  ${context.text.slice(20, 80)} `}) 
}, 10)
});

updates.hear(/(?:!-report|!репорт) (.*)/i, async (context) => {	
    await context.send('Репорт отправлен, в скором времени мы на него ответим!')
setTimeout(() => { 
vk.api.messages.send({chat_id: 4, message: `@id${context.senderId}(${context.user.nickname}) сделал репорт:  ${context.text.slice(8, 80)} \n id: ${context.senderId} `}) 
}, 10)
});


updates.hear(/(?:!-report|!объявление) ([0-9]+) (.*)/i, async (context) => {
    if (context.user.permission < 3) return context.send(`У вас нет на это прав!`);	
const user = context.$match[1]
    await context.send('Объявление сделано!')
setTimeout(() => { 
vk.api.messages.send({chat_id: user, message: `@id${context.senderId}(${context.user.nickname}) сделал объявление:  ${context.text.slice(13, 80)} `}) 
}, 10)
});

updates.hear(/(?:!-report|!админ)/i, async (context) => {
    if (context.user.permission < 1) return context.send(`У вас нет на это прав!`);	
    await context.send('Мои команды: \n  -2- !give (0-3000) (айди) - выдать пользователю денег \n -5- !выдать (сумма) - выдать себе денег \n -5- !выдать (сумма) (айди) - выдать денег пользователю \n -5- !ответить (айди) (текст) - ответить на репорт \n -5- !написать (айди) (текст)  - написать пользователю \n -3- !объявление (айди чата) (текст)  - сделать объявление в чате \n  -5- /!удалить (ссылка) - забанить пользователя \n -5- /!добавить (ссылка) - разбанить пользователя \n -5- !устоновить (сумма) (айди) - устоновить баланс игроку \n -1- !профиль (айди) - посмотреть профиль ползователя \n -5- !префикс (текст) - устоновить себе роль \n -5- !левел (айди) (уровень permission)')

});

updates.hear(/(?:!-report|!написать) ([0-9]+) (.*)/i, async (context) => {
    if (context.user.permission < 3) return context.send(`У вас нет на это прав!`);	
const user = context.$match[1]
    await context.send('Объявление сделано!')
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `@id${context.senderId}(${context.user.nickname}) написал вам письмо:  ${context.text.slice(20, 80)} `}) 
}, 10)
});
updates.hear(/^!Выдать ([0-9]+) ([0-9]+)/i, async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);

const amount = context.$match[1]
const user = context.$match[2]
if(!users[user]) return await context.send('Пользователь не найден!')
users[user].balance += Number(amount)
 await context.send(`@id${context.senderId}(${context.user.nickname}) выдал @id${user}(${users[user].nickname}) ${amount} монет \n`)
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `@id${context.senderId}(${context.user.nickname}) выдал вам ${amount} монет`}) 
}, 10)
});
updates.hear(/^!Устоновить ([0-9]+) ([0-9]+)/i, async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);
const amount = context.$match[1]
const user = context.$match[2]
if(!users[user]) return await context.send('Пользователь не найден!')
users[user].balance = Number(amount)
 await context.send(`@id${context.senderId}(${context.user.nickname}) устоновил ${amount} монет @id${user}(${users[user].nickname})!`)
setTimeout(() => { 
vk.api.messages.send({user_id: user, message: `@id${context.senderId}(${context.user.nickname}) устоновил вам ${amount} монет`}) 
}, 10)
});

updates.hear(/^!give ([0-3000]) ([0-9]+)/i, async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (context.user.permission < 2) return context.send(`У вас нет на это прав!`);
const amount = context.$match[1]
const user = context.$match[2]
if(!users[user]) return await context.send('Пользователь не найден!')
users[user].balance += Number(amount)
return await context.send(`@id${context.senderId}(${context.user.nickname}) выдал ${amount} монет @id${user}(${users[user].nickname})!`)
});

updates.hear(/^!профиль ([0-9]+)/i, async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (context.user.permission < 1) return context.send(`У вас нет на это прав!`);
    
const user = context.$match[1]
const amount = context.$match[1]
if(!users[user]) return await context.send('Пользователь не найден!')
return await context.send(            `&#128511; имя: ${users[user].nickname} id: ${amount}\n` +
            `&#128178; Баланс: ${ users[user].balance }$\n` +
            `&#127942; Рейтинг: ${ users[user].top }\n` +
            `&#128304; Роль: ${users[user].role} \n`+
            `&#128304; permission: ${users[user].permission} \n`+			
            `&#128665; Машина: ${ users[user].car } \n  &#128241; Телефон: ${ context.user.phone } \n &#127968; Жильё: ${ context.user.home }\n`+
			`&#127345; Предупреждений: ${users[user].warn} \n Приглашен: ${users[user].job1} \n пригласил: ${users[user].res}`	)
});





updates.hear("!up", async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (!~admins.indexOf(context.senderId)) {
        return context.send(`Нету прав!`);
    }
    // Если да, то выдаем админ права ака 2
    context.user.permission = 6;
	context.user.role='Администратор'
    await context.send(`Вам выданы права администратора`);
});

updates.hear("!down", async (context) => {
    // Проверка находитесь ли вы в массиве админов
    if (!~admins.indexOf(context.senderId)) {
        return context.send(`Нету прав!`);
    }
    // Если да, то выдаем админ права ака 2
    context.user.permission = 0;
	context.user.role='Администратор'
    await context.send(`Вам выданы права администратора`);
});

updates.hear("!rules-bot", async (context) => {
    await context.send(`Вас могут забанить у бота за: \n 1) Спам \n 2) Флуд \n 3) Оскорбления (игроков и администрации) \n 4) Обман администрации`);
});




updates.hear(/(?:!reset|!ресет)/i, (context) => {
    // Просто, чтобы каждый раз не писать context.user
    let { user } = context;
    // Проверяем, прошло ли 24 часа спустя последней активации
    if (getUnix() - user.reset < 86400) {
        return context.send("Ещё не прошло 24 часа!");
    }
    user.balance = 1000;
    // В bonus записываем текущую дату
    user.reset = getUnix();
    return context.send("Вы сбросили баланс до 1000$, приходите еще через 24 часа.");
});








updates.hear(/(?:!who|!кто) (.*)/i, async (context) => {

    if (!context.isChat) {
        return;
    }

    let { profiles } = await vk.api.messages.getConversationMembers({
        peer_id: context.peerId
    });

    let profile = getRandomElement(profiles);
	
    await context.send(
        getRandomElement(['Это точно', 'Я уверен, что это', 'Сотку даю, что это']) + ' -- @id' + profile.id + '(' + profile.first_name + ')'
    );
});

updates.hear(/(?:!info|!инфа) (.*)/i, async (context) => {
    // Самая простая команда, просто рандомим число в промежутке 1-110
        context.user.top += 1;			
    await context.send(`Вероятность -- ${getRandomInt(110)}%`);
});
updates.hear(/(?:!nick|!ник) (.*)/i, async (context) => {
	context.user.nickname = `${context.text.slice(4, 20)}`
    return context.send(`Ваш ник теперь: ${context.text.slice(4, 20)} `)
});


updates.hear(/(?:!префикс) (.*)/i, async (context) => {
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);
	context.user.role = `${context.text.slice(8, 20)}`
    return context.send(`Ваш префикс теперь: ${context.text.slice(8, 20)} `)
});
updates.hear(/(!profile|!профиль)/i, async (context) => {
    if (context.user.permission < 1 ) return context.send(
            `&#128511; Твоё имя: ${context.user.nickname} id: ${context.senderId}\n` +
            `&#128178; Баланс: ${ context.user.balance }$\n` +
            `&#127942; Рейтинг: ${ context.user.top }\n` +
            `&#128304; Роль: ${context.user.role} \n`+
            `&#128304; permission: ${context.user.permission} \n`+			
            `&#128665; Машина: ${ context.user.car } \n  &#128241; Телефон: ${ context.user.phone } \n &#127968; Жильё: ${ context.user.home }\n`+
			`&#127345; Предупреждений: ${context.user.warn} \n Приглашен: ${context.user.job1} \n пригласил: ${context.user.res}`	
			
        ); 	
        await context.send(
            `&#128511; Твоё имя: ${context.user.nickname} id: ${context.senderId}\n` +
            `&#128178; Баланс: ${ context.user.balance }$\n` +
            `&#127942; Рейтинг: ${ context.user.top }\n` +
            `&#128304; Роль: ${context.user.role} \n`+
            `&#128304; permission: ${context.user.permission} \n`+			
            `&#128665; Машина: ${ context.user.car } \n  &#128241; Телефон: ${ context.user.phone } \n &#127968; Жильё: ${ context.user.home }\n`+
			`&#127345; Предупреждений: ${context.user.warn} \n Приглашен: ${context.user.job1} \n пригласил: ${context.user.res}`	
        ); 
});


//lobby
const lobbies = {};
updates.hear(/(?:!дуэль) ([0-9]+)/i, async (context) => {

    if (!context.isChat) return context.send(`Эта команда работает только в беседах!`);

    let amount = Number(context.$match[1]);

    if (amount < 100) return context.send(`&#129312; Некорректная ставка! \n Ставка должна быть не меньше 100 $ \n &#128176; ваш баланс: ${context.user.balance}, ставка: ${amount}`);;
    if (context.user.balance < amount ) return context.send(`&#129312; Некорректная ставка!  \n Ставка превышает вааш баланс! \n &#128176; ваш баланс: ${context.user.balance}, ставка: ${amount}`);;
    if (!lobbies[context.chatId]) {

        context.user.balance -= amount;

        lobbies[context.chatId] = {
            players: [context.senderId],
            bank: amount
        };

        return context.send(`Лобби успешно создано! Ожидаем оппонента.. &#129312; \n &#128178; Ставка: ${amount}`)
    }

    if (!~lobbies[context.chatId].players.indexOf(context.senderId)) {

        context.user.balance -= amount;
        context.user.top += 1;		
        lobbies[context.chatId].players.push(context.senderId);

        let bank = lobbies[context.chatId].bank + amount;

        let winner = getRandomElement(lobbies[context.chatId].players);

        users[winner].balance += lobbies[context.chatId].bank + amount;

        delete lobbies[context.chatId];

        return context.send(`Выиграл *id${winner}, он забрал: ${bank}$`);
    }
});




updates.hear(/(?:!shop|!магазин)/i, async (context) => {
        await context.send(
            `&#128664; Транспорт:\n 01.Lada Kalina - 22400 \n 02. reno logan - 95000 \n 03.Patriot - 98400 \n 04.porsche panamera - 1279000\n Телефоны: \n 05.Nokia - 40000 \n 06.Alcotel - 140000 \n 07.Asus - 140000 \n 08.Apple - 4400000 \n Жильё: \n 09.Сьемная комната - 40000 \n 10.Деревянный дом - 44000 \n11.Красивый дом - 750000 \n 12.Номер в отеле - 1250000 \n 13.Особняк - 2250000 \n Для покупки пишите !купить <номер товара>`	
        );
});
updates.hear(/(?:!buy|!купить) (01)/i, async (context) => {
    if (context.user.balance > 22400) {
        context.user.balance -= 22400;
		context.user.car = 'Lada Kalina'
        context.user.top += 1;			
        await context.send(
             `&#128665; Вы купили ${ context.user.car } за 22400 рублей`
        )}
    if (context.user.balance < 22400) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}	
    });    
	
updates.hear(/(?:!buy|!купить) (02)/i, async (context) => {
    if (context.user.balance > 95000) {
        context.user.balance -= 95000;		
        context.user.top += 1;	
		context.user.car = 'Renault Loga'		
        await context.send(
            `&#128665; Вы купили ${ context.user.car } за 95000 рублей`
        )}
    if (context.user.balance < 95000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}				
    });   	
	
updates.hear(/(?:!buy|!купить) (03)/i, async (context) => {
    if (context.user.balance > 98900) {
        context.user.balance -= 98900;		
        context.user.top += 1;	
		context.user.car = 'Patriot'		
        await context.send(
            `&#128665; Вы купили ${ context.user.car } за 98400 рублей`
        )}
    if (context.user.balance < 98900) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}		
    });  	
updates.hear(/(?:!buy|!купить) (04)/i, async (context) => {
    if (context.user.balance > 1279000) {
        context.user.balance -= 1279000;		
        context.user.top += 1;	
		context.user.car = 'porsche panamera'		
        await context.send(
            `&#128665; Вы купили ${ context.user.car } за 1279000 рублей`
        )}
    if (context.user.balance < 1279000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}		
    });  
updates.hear(/(?:!buy|!купить) (05)/i, async (context) => {
    if (context.user.balance > 40000) {
        context.user.balance -= 40000;		
        context.user.top += 1;	
		context.user.phone = 'Nokia '		
        await context.send(
            `Вы купили ${ context.user.phone } за 40000 рублей`
        )}
    if (context.user.balance < 40000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}	
    });  	
updates.hear(/(?:!buy|!купить) (06)/i, async (context) => {
    if (context.user.balance > 140000) {
        context.user.balance -= 140000;		
        context.user.top += 1;	
		context.user.phone = 'Alcotel '		
        await context.send(
            `Вы купили ${ context.user.phone } за 140000 рублей`
        )}
    if (context.user.balance < 140000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    });  	
updates.hear(/(?:!buy|!купить) (07)/i, async (context) => {
    if (context.user.balance > 1400000) {
        context.user.balance -= 1400000;		
        context.user.top += 1;	
		context.user.phone = 'Asus'		
        await context.send(
            `Вы купили ${ context.user.phone } за 1400000 рублей`
        )}
    if (context.user.balance < 1400000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    });  		
updates.hear(/(?:!buy|!купить) (08)/i, async (context) => {
    if (context.user.balance > 4400000) {
        context.user.balance -= 4400000;		
        context.user.top += 1;	
		context.user.phone = 'Apple'		
        await context.send(
            `Вы купили ${ context.user.phone } за 4400000 рублей`
        )}
    if (context.user.balance < 4400000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    });  	
updates.hear(/(?:!buy|!купить) (09)/i, async (context) => {
    if (context.user.balance > 40000) {
        context.user.balance -= 40000;		
        context.user.top += 1;	
		context.user.phone = 'Сьемная команта'		
        await context.send(
            `Вы купили ${ context.user.phone } за 440000 рублей`
        )}
    if (context.user.balance < 40000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    });  	
updates.hear(/(?:!buy|!купить) (10)/i, async (context) => {
    if (context.user.balance > 44000) {
        context.user.balance -= 44000;		
        context.user.top += 1;	
		context.user.home = 'Деревянный дом'		
        await context.send(
            `Вы купили ${ context.user.home } за 44000 рублей`
        )}
    if (context.user.balance < 44000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    }); 	
updates.hear(/(?:!buy|!купить) (11)/i, async (context) => {
    if (context.user.balance > 750000) {
        context.user.balance -= 750000;		
        context.user.top += 1;	
		context.user.home = 'Красивый дом'		
        await context.send(
            `Вы купили ${ context.user.home } за 75000 рублей`
        )}
	    if (context.user.balance < 750000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}		
    }); 	
updates.hear(/(?:!buy|!купить) (12)/i, async (context) => {
    if (context.user.balance > 1250000) {
        context.user.balance -= 1250000;		
        context.user.top += 1;	
		context.user.home = 'Номер в отеле'		
        await context.send(
            `Вы купили ${ context.user.home } за 125000 рублей`
        )}
    if (context.user.balance < 1250000) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    }); 	
updates.hear(/(?:!buy|!купить) (13)/i, async (context) => {
    if (context.user.balance > 2250000) {
        context.user.balance -= 2250000;		
        context.user.top += 1;	
		context.user.home = 'Особняк'		
        await context.send(
            `Вы купили ${ context.user.home } за 225000 рублей`
        )}
    if (context.user.balance < 2249999) {		
await context.send(
`&#9888; Для покупки этого товара вам нехватает монет!`
)}			
    }); 	
updates.hear(/(?:!Выдать) ([0-9]+)/i, async (context) => {
    if (context.user.permission < 5) return;
    let amount = Number(context.$match[1]);
        context.user.balance += amount;
    await context.send(`Теперь твой баланс: ${ context.user.balance } $`)		
});

updates.hear(/^!варн ([0-9]+)/i, async (context) => {	
    if (context.user.permission < 1) return;
const user = context.$match[1]
if(!users[user]) return await context.send('Пользователь не найден!')
if(users[user].warn > 3) return await context.send(`Пользователь забанен после 3ех предупреждений. ${users[user].ban = true}`)		
return await context.send(`Теперь у @id${user}(${users[user].nickname}) ${users[user].warn += 1} / 3 предупреждений!`)
});

updates.hear(/^!анварн ([0-9]+)/i, async (context) => {	
    if (context.user.permission < 1) return;
const user = context.$match[1]
if(!users[user]) return await context.send('Пользователь не найден!')
return await context.send(`Теперь у @id${user}(${users[user].nickname}) ${users[user].warn = 0} / 3 предупреждений!`)
});

updates.hear(/(?:Ремонт)/i, async (context) => {
    if (context.user.permission < 1) return;
    context.job1 = 0
    await context.send(`Починка осуществлена! `)		
});

updates.hear(/(!balance|!баланс)/i, async (context) => {
    await context.send(`Твой баланс: ${ context.user.balance } $`)
	        context.user.top += 1;		
});


updates.hear(/(!inv|!инв)/i, async (context) => {
await context.send(`&#128665; Машина: ${ context.user.car } \n  &#128241; Телефон: ${ context.user.phone } \n &#127968; Жильё: ${ context.user.home }`)
        context.user.top += 1;	
		
});










updates.hear(/!рулетка ([0-9]+)/i, async (context) => {
        context.user.top += 1;				
    // Повторение костей
    let amount = Number(context.$match[1]);
    // Тоже повторение костей
    if (context.user.balance < amount || amount < 100) {
        return context.send(`Некорректная ставка!`);
    }

    if (getRandomInt(1)) {

        context.user.balance += amount;
		context.user.top += 1;		
        await context.send(
            `УРА! Ты выиграл ${ amount } $\n` +
            `Твой баланс: ${ context.user.balance } $`
        );
    } else {
        context.user.balance -= amount;
        context.user.top += 1;				
        await context.send(
            `Увы, но ты проиграл ${ amount } $\n` +
            `Твой баланс: ${ context.user.balance } $`
        );
    }
});


updates.hear(/!казино ([0-9]+)/i, async (context) => {
        context.user.top += 1;				
    // Повторение костей
    let amount = Number(context.$match[1]);
    // Тоже повторение костей
    if (context.user.balance < amount || amount < 100) {
        return context.send(`Некорректная ставка!`);
    }

    if (getRandomInt(1)) {

        context.user.balance += amount;
		context.user.top += 1;		
        await context.send(
            `Ты победил! Твой баланс: ${ context.user.balance +=  getRandomInt(999) } $` 
        );
    } else {
        context.user.balance -= amount;
        context.user.top += 1;				
        await context.send(
            `Увы, но ты проиграл ${ amount } $\n` +
            `Твой баланс: ${ context.user.balance } $`
        );
    }
});

updates.hear(/!да или нет/i, async (context) => {
        context.user.top += 1;				
    if (getRandomInt(1)) {	
        await context.send(
            `ДА` 
        );
    } else {		
        await context.send(
            `НЕТ `
        );
    }
});





updates.hear(/(?:!донат)/i, async (context) => {
    if (context.user.permission < 1) return context.send(`Роль: обычный игрок`)	;
        context.user.top += 1;			
    // Лобби игры должны работать только в беседах, поэтому, если это не беседа, то игнорим.
    // Кидаем нашу ставку в переменную, для удобства.
    await context.send(`Роль: Администратор`)	
        context.user.top += 1;			
});

updates.hear(/!удалить ([^\s]+)/i, async (context) => {
    // Проверка на права
    if (context.user.permission < 5) return;
    // "Парсим" ссылку и получаем данные с нее, встроенный метод в vk-io
    let link = await vk.snippets.resolveResource(context.$match[1]);
    // Проверяем, если тип ссылки не пользователь, то возвращаем Invalid link!
    if (link.type !== "user") {
        return context.send(`Invalid link`);
    }
    // Проверяем существует ли пользователь в базе, если нет, то создаем его
if (!users[context.senderId]) {
const info = await vk.api.users.get({user_ids: context.senderId})
users[context.senderId] = {
permission: 0,
balance: 1000,
top: 0,
buy: 0,
ban: false,
nickname: `${info[0].first_name} ${info[0].last_name}` ,
home: `нету`,
phone: `нету`,
car: `нету`,
		"shop": 22400,
		"res": 0,
		"job1": 0,
		"job": 0,
		"warn":0,		
role:`Обычный игрок`	
};
    }
    // В любом случае выдаем этому человек бан
    users[link.id].ban = true;
    await context.reply(`Пользователь успешно забанен!`);
});



updates.hear(/!добавить ([^\s]+)/i, async (context) => {
    // Повторение
    if (context.user.permission < 5) return;
    let link = await vk.snippets.resolveResource(context.$match[1]);

    if (link.type !== "user") {
        return context.send(`Invalid link`);
    }

if (!users[context.senderId]) {
const info = await vk.api.users.get({user_ids: context.senderId})
users[context.senderId] = {
permission: 0,
balance: 1000,
top: 0,
buy: 0,
ban: false,
nickname: `${info[0].first_name} ${info[0].last_name}` ,
home: `нету`,
phone: `нету`,
car: `нету`,
		"shop": 22400,
		"res": 0,
		"job1": 0,
		"job": 0,
		"warn":0,		
role:`Обычный игрок`	
};
    }
    // Снимаем бан пользователю
    users[link.id].ban = false;
    await context.reply(`Вы разбанили этого пользователя`);
});
updates.hear(/!инфо ([^\s]+)/i, async (context) => {
    // Повторение
    if (context.user.permission < 5) return context.send(`У вас нет на это прав!`);
    let link = await vk.snippets.resolveResource(context.$match[1]);

    if (link.type !== "user") {
        return context.send(`Invalid link`);
    }

if (!users[context.senderId]) {
const info = await vk.api.users.get({user_ids: context.senderId})
users[context.senderId] = {
permission: 0,
balance: 1000,
top: 0,
buy: 0,
ban: false,
nickname: `${info[0].first_name} ${info[0].last_name}` ,
home: `нету`,
phone: `нету`,
car: `нету`,
		"shop": 22400,
		"res": 0,
		"job1": 0,
		"job": 0,
		"warn":0,		
role:`Обычный игрок`	
};
    }
    await context.reply(`Айди пользователя: ${link.id} \n айди чата: ${ context.isChat ? "#" + context.chatId : "" }`);
});



updates.hear(/(?:!топ|!top)/i, (context) => {
    // Для хранения юзверов
    let _users = [];
    // Перебираем нашу "базу"
    for (let key in users) {
        // Не пропускаем админов или заблокированных
        if (users[key].permission === 0 && !users[key].ban){
            _users.push({
                id: key,
                balance: users[key].balance,
				nickname: users[key].nickname,
            });
        }
    }
    // Отправляем результат
    return context.send(
        "&#128201; Топ-10 по балансу:\n" +
        _users
            .sort((a, b) => b.balance - a.balance)  // Сортируем по балансу
            .slice(0, 10)   // Берем только 10 элементов
            .map((x, i) => `${++i}. @id${x.id}(${x.nickname}) - ${x.balance}`)
            .join("\n")
    );
});

updates.hear(/(?:!reyting|!рейтинг)/i, (context) => {
    // Для хранения юзверов
    let _users = [];
    // Перебираем нашу "базу"
    for (let key in users) {
        // Не пропускаем админов или заблокированных
        if (users[key].permission === 0 && !users[key].ban){
            _users.push({
                id: key,
                top: users[key].top,
				nickname: users[key].nickname,
            });
        }
    }
    // Отправляем результат
    return context.send(
        "&#128201; Топ-10 по рейтингу:\n" +
        _users
            .sort((a, b) => b.top - a.top)  // Сортируем по балансу
            .slice(0, 10)   // Берем только 10 элементов
            .map((x, i) => `${++i}. @id${x.id}(${x.nickname}) - ${x.top}`)
            .join("\n")
    );
});






updates.hear("ping", async (context) => {
    await context.send("pong!");
});



updates.hear("!хелп", async (context) => {
    await context.send("&#128214; Мои команды: \n &#9999; Инфа (текст) - вероятность инфы \n &#10002; Кто (текст) - Выберает пользователя\n &#128182; Баланс - узнать ваш баланс  \n &#9876; Дуэль (Ставка >100) - дуэль \n &#127920; Рулетка (Ставка >100) - рулетка \n &#127183; Донат - узнать вашу роль \n &#128372; Профиль - ваш профиль \n &#9410; магазин - узнать про товары и их строимость \n &#128176; трейд (сумма) (Цифровой id пользователя пример: трейд 100 401970788) \n &#127920; казино (ставка) - казино \n &#10071; rules-bot - правила бота \n &#128215; топ - топ 10 по балансу \n &#128216; рейтинг - топ 10 по рейтингу \n &#10071; Все команды пишем через !");
        context.user.top += 1;			
});



updates.hear("сохра", async (context) => {
    // Получаем стену паблика
    let { items } = await vk.api.wall.get({
        owner_id: -172058080,
        offset: 1,
        count: 200
    });
    // Выбираем случайный пост
    let item = getRandomElement(items);
    // Выбираем именно первое изображение из поста
    item = item.attachments[0].photo;
    // Отправляем результат
    await context.send({
        attachment: "photo" + item.owner_id + "_" + item.id
    });
});

updates.hear("мем", async (context) => {
    // Получаем стену рандомного паблика
    let { items } = await vk.api.wall.get({
        domain: getRandomElement(["mudakoff", "chan4", "rzeki4"]),
        offset: 1,
        count: 200
    });
    // Выбираем случайный пост
    let item = getRandomElement(items);
    // Выбираем именно первое изображение из поста
    item = item.attachments[0].photo;
    // Отправляем результат
    await context.send({
        attachment: "photo" + item.owner_id + "_" + item.id
    });
});

updates.hear(/rand ([0-9]+)/i, async(context) => {
    await context.send(
        `Случайное число -- ${ getRandomInt(context.$match[1]) }`
    );
});



async function run() {
    await vk.updates.startPolling();
    console.log("Longpoll started");
}
 
run().catch(console.error);
// Get UnixDate in seconds
function getUnix() {
    return Math.floor(Date.now() / 1000);
}
// Random integer
function getRandomInt(x, y) {
    return y ? Math.round(Math.random() * (y - x)) + x : Math.round(Math.random() * x);
}
 
// Random element from array
function getRandomElement(array) {
    return array[getRandomInt(array.length - 1)];
}

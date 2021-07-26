# werewolfBot


#### Commands for the werewolfBot

- `creategameroom` create a new game room and generate the `chatid`. The creator becomes the admin
- `joinroom #chatid` join a game room  with the `chatid`
- `startgame` start a game (everybody can) and then the timer starts
- `players` get a list of current players
- `help` get info on commands, roles and how to play
- `flee` drop from the game
- `stats` get a link for stats
- `chatid` gets the id of the group chat(room)
- `forcestart` (Group Admin), start the game
- `config` (Group Admin), set options for group
- `smite` (Group Admin), kill players
- `endgame` end the game, delete the gameRoom

- `nextgame` bot will PM you when next game is starting
- `ping` check bot reply time
- `version` gets the current version
- `play again` create a new game with same options and offer a request to all of players

## How to deploy ReislerOnlineBot
### Heroku Deploy
  - [![Deploy To Heroku](https://www.herokucdn.com/deploy/button.svg)](https://github.com/ReislerSupport/ReislerOnline)
{
  " name " : " Telgraf Yükleme Botu " ,
  " açıklama " : " telegra.ph bağlantı yükleyici botuna giden basit bir küçük ortam veya dosya " ,
  " depo " : " https://github.com/FayasNoushad/Telegraph-Uploader-Bot " ,
  " anahtar kelimeler " : [ " telgraf " , " dosya veya medya " , " bağlantı yükleyici " , " telgraf botu " ],
  " env " : {
    " BOT_TOKEN " : {
      " description " : " @Botfather'dan Bot jetonunuz "
    },
    " API_ID " : {
      " description " : " https://my.telegram.org/apps adresinden API_ID'niz "
    },
    " API_HASH " : {
      " description " : " https://my.telegram.org/apps adresinden API_HASH'iniz "
    }
   },
   " yapı paketleri " : [
    {
      " url " : " heroku/python "
    }
  ]
}

<template lang='pug'>
div
    div(id='game' v-if='!table')
        div(class='game__header')
            p(class='game__rules') Нажмите на букву и соберите слово
            p(class='game__time') Время: 
                span {{ time }}

        div(class='game__wordSpot' v-bind:style='styleBoard')
            div(class='game__board__letter' v-for='letter in userWord') {{ letter }}
        
        div(class='game__board')
            div(class='game__board__letter' v-for='letter in anagram' @click='chooseLetter($event)') {{ letter }}
            
        div(class='game__reset' v-if='userWord.length>0' @click='resetGame') Сбросить
        
        div(class='game__end' v-if='endgame') 
            div(class='game__end__window')
                p(class='game__end__text') {{ phrase }}
                div(class='game__end__interface')
                    div(class='game__end__btn tryagain_btn' @click='newGame') Конечно!
                    div(class='game__end__btn enough_btn' @click='showTable') Я уже устал
                    
    div(class='results' v-else)
        p(class='results__header') Угаданные слова
        table(v-if='records.length>0')
            tr
                td #
                td Слово
                td Время (сек)
            tr(v-for= 'record in records')
                td {{ record.id }}
                td {{ record.word }}
                td {{ record.time }}
                
        p(class='results__header' v-else) Слов нет
                
        div(class='game__again' @click='playAgain') Сыграть еще
            
</template>

<script>

export default {
    name: 'App',
    data() {
        return {
            encryptWord: '',     // слово, которое мы получили от апи
            anagram: [],         // массив - буквы вперемешку
            userWord: [],        // массив - буквы, которые выбирает пользователь; буква удаляется из anagram
            api: '',             // текущий номер апи
            allApis: [],         // все апи в текущей сессии
            records: [],         // таблица рекордов
            time: 0,             // время угадывания
            endgame: false,      // все буквы выбраны
            table: false,       
            phrase: '',
            styleBoard: {        // стили по-умолчанию для поля
                gridTemplateColumns: '',
                gridTemplateRows: '',
                width: '',
                height: '5.3em'
            },
            timerState: ''
        }
    },
    
    methods: {    
        // формируем случайное число от 2 до 1368, проверяем, уникально ли оно в текущей сессии
        getNumberForApi() {
            const apiNum = Math.floor(Math.random() * Math.floor(1366)) + 2;
            
            if (this.allApis.indexOf(apiNum) === -1){
                this.allApis.push(apiNum);
                return apiNum;
            } else {
                this.getNumberForApi();
            }
        },
        
        // обращаемся к апи
        getWord() {
            const cite = 'https://apidir.pfdo.ru/v1/directory-program-activities/' + this.getNumberForApi();
            
            fetch(cite)
            .then(res => res.ok ? res : Promise.reject(res))
            .then(res => {
                return res.json();
            }).then(this.getPhrase);
        },
        
        // если мы успешно обратились к апи, получаем фразу (слово из справочника “Виды деятельности”); 
        getPhrase(data) {
            if (data.result_message === 'Запись не найдена'){
                this.getWord();
            } else {
                this.encryptWord = data.data.name.toUpperCase();
                
                //подсказка :)
                console.log('Посдказка: ' + this.encryptWord);
                this.anagram = this.getAnagram();
                this.setStyleBoard(this.anagram.length);
                this.timer('start');
            }
        },
        
        // меняем площадь табла для слова
        setStyleBoard(length) {
            const proportion = Math.ceil(screen.width / 88);
            
            if (length>proportion) {
                this.styleBoard.gridTemplateColumns = 'repeat(' + proportion + ', 5em)';
                this.styleBoard.gridTemplateRows = 'repeat(' + Math.ceil(length/proportion) + ', 5em)';
                this.styleBoard.height = Math.ceil(length/proportion) * 5 + 'em';
            } else this.styleBoard.gridTemplateColumns = 'repeat(' + length + ', 5em)';
        },
        
        // перемешиваем буквы в слове
        getAnagram() {
            // запоминаем слово
            let anagram = this.encryptWord;
            
            // преобразуем в массив и перемешиваем
            anagram = anagram.split('').sort(() => Math.random() - 0.5);
            
            // заменяем пробелы на символ _
            anagram.forEach(function(item, i) { if (item === ' ') anagram[i] = '_'; });
            return anagram;
        },
        
        // таймер времени угадывания слова
        timer(val) {
            const timeStart = new Date().getTime();
            this.timerState = val;
            
            let tick = setInterval(() => {
                this.time = getDifferent(timeStart);
                if (this.timerState === 'stop'){
                    this.time = 0;
                    clearInterval(tick);
                }
            }, 1000);
            
            function getDifferent(t) {
                const timeEnd = new Date().getTime();
                return parseInt((timeEnd - t) / 1000);
            }
        
        },

        // пользователь выбрал букву
        chooseLetter(e) {
            const t = e.target;
            const toDelete = this.anagram.indexOf(t.textContent);
            this.userWord.push(t.textContent);
            this.anagram.splice(toDelete, 1);
            
            if (this.anagram.length === 0){
                this.gameStop();
            }
        },
        
        // пользователь выбрал все буквы
        gameStop() {
            this.endgame = true;
            this.timer('stop');
            
            if (this.userWord.join('') === this.encryptWord) {
                this.records.push({
                    id: this.records.length + 1,
                    word: this.encryptWord,
                    time: this.time
                });
                this.phrase = 'Вы выиграли! Повторить?';
            } else {
                this.phrase = 'Буквы кончились... попробовать еще раз?';
            }
        },
        
        // сброс игры
        resetGame() {
            this.anagram = this.getAnagram();
            this.userWord = [];
            this.timer('start');
        },
        
        // новая игра
        newGame() {
            if (this.anagram.length === 0 && this.userWord.join('') !== this.encryptWord){
                this.resetGame();
            } else {
                this.playAgain();
            }
            
            this.userWord = [];
            this.endgame = false;
        },
        
        // сыграть еще раз
        playAgain() {
            this.table = false;
            this.encryptWord = '';
            this.anagram = [];
            this.userWord = [];
            this.api = '';
            this.getWord();
        },
        
        // показать таблицу с результатами
        showTable() {
            this.table = true;
            this.endgame = false;
        }
    },
    
    mounted() {
        // при загрузке приложения мы сразу обращаемся к апи и получаем слово
        this.newGame();
    }
}
    
</script>

<style lang="scss">
    body, div, p {
        margin: 0;
        padding: 0;
    }
    
    %flexCenter {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    %letter {
        color: beige;
        text-shadow: #000 1px 1px 0, #000 -1px -1px 0, #000 -1px 1px 0, #000 1px -1px 0;
        font-weight: bold;
        letter-spacing: 2px;
    }
    
    #game {
        padding-top: 20px;
        
        .game__header {
            @extend %flexCenter;
            
            .game__rules {
                width: 100%;
                text-align: center;
                font-size: 2em;
                margin-bottom: 20px;
                @extend %letter;
            }
            
            .game__time {
                position: absolute;
                right: 30px;
                top:20px;
                @extend %letter;
                font-size: 2em;
                
                span {
                    color: #9c00ff;
                }
            }
        }
        
        .game__wordSpot {
            width: 96%;
            border: 2px solid #fc7f1b;
            border-radius: 20px;
            margin: auto;
            background: beige;
            display: grid;  
        }
        
        .game__board {
            display: grid;
            margin: auto;
            grid-template-columns: repeat(12, 5em);
            width: 12 * 5em;
        }
        
        .game__board__letter {
            font-size: 3em;
            cursor: pointer;
            padding: 10px;
            margin: 5px;
            text-align: center;
            background: rgb(252,233,0);
            background: radial-gradient(circle, rgba(252,233,0,1) 0%, rgba(251,54,0,1) 87%, rgba(255,0,0,1) 100%);
            border-radius: 10px;
            @extend %letter;

            &:hover {
                background: rgb(252,233,0);
                background: radial-gradient(circle, rgba(252,233,0,1) 36%, rgba(251,54,0,1) 100%, rgba(255,0,0,1) 100%);
            }
        }
        
        .game__reset {
            font-size: 2em;
            cursor: pointer;
            padding: 10px;
            background: #9c00ff;
            text-align: center;
            width: 200px;
            margin: 50px auto;
            @extend %letter;
            border-radius: 10px;
            
            &:hover {
                background: orangered;
            }
        }
        
        .game__end {
            display: block;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.6);
            z-index: 100;
            
            .game__end__window {
                @extend %letter;
                font-size: 2em;
                background-color: beige;
                margin: 20% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 60%;
                z-index: 99;
                text-align: center;
                border-radius: 10px;
                
                .game__end__interface {
                    @extend %flexCenter;
                    width: 50%;
                    margin: auto;
                    justify-content: space-between;
                    margin-top: 30px;
                    
                    .game__end__btn {
                        @extend %letter;
                        background: #9c00ff;
                        font-size: .6em;
                        padding: 10px 20px;
                        cursor: pointer;
                        border-radius: 10px;
                        
                        &:hover{
                            background: orangered;
                        }
                    }
                }
            }
        }
    }
    
    .results{
        font-size: 2em;
        @extend %letter;
        @extend %flexCenter;
        flex-direction: column;
        width: 70%;
        margin: auto;
        margin-top: 100px;
        
        .results__header{
            width: 100%;
            text-align: center;
            font-size: 2em;
            margin-bottom: 20px;
            @extend %letter;
        }
        
        td{
            border-bottom: 2px solid red;
            padding: 10px 20px;
            text-align: center;
        }
        
        .game__again{
            font-size: 0.6em;
            cursor:pointer;
            padding: 10px;
            background: #9c00ff;
            text-align: center;
            width: 200px;
            margin: 50px auto;
            @extend %letter;
            border-radius: 10px;

            &:hover{
                background: orangered;
            }
        }
    }
    
</style>

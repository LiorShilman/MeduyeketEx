"use strict";

// A word guessing game inspired by Wordle
// Copyright (C) 2022  Amir Livne Bar-on
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

/*class gameBoard {
    constructor(idx) {
        this.idx = idx;
    }
    //method to return the string
    toString() {
        return (`Game idx : ${this.idx}`);
    }
}*/

const COLOR = ['#E07A5F', '#81B29A', '#F2CC8F', '#C792EA', '#F78C6B', '#89DDFF', '#FFCB77', '#7EC8E3', '#E8A87C'];

function get_date() {
    return new Date().toLocaleDateString('he-IL', {
        timeZone: 'Asia/Jerusalem'
    });
}


const today = get_date();
const all_words_of_the_day = calculate_meduyeket(today);
const word_of_the_day = all_words_of_the_day[0];
const word_of_the_day2 = all_words_of_the_day[1];
const word_of_the_day3 = all_words_of_the_day[2];
const word_of_the_day4 = all_words_of_the_day[3];
const word_of_the_day5 = all_words_of_the_day[4];
const word_of_the_day6 = all_words_of_the_day[5];
const word_of_the_day7 = all_words_of_the_day[6];
const word_of_the_day8 = all_words_of_the_day[7];
const word_of_the_day9 = all_words_of_the_day[8];
const word_of_the_day10 = all_words_of_the_day[9];

let guesses = [];
let guesses2 = [];
let guesses3 = [];
let guesses4 = [];
let guesses5 = [];
let guesses6 = [];
let guesses7 = [];
let guesses8 = [];
let guesses9 = [];
let guesses10 = [];

let current_pos1 = 1;
let current_pos2 = 1;
let current_pos3 = 1;
let current_pos4 = 1;
let current_pos5 = 1;
let current_pos6 = 1;
let current_pos7 = 1;
let current_pos8 = 1;
let current_pos9 = 1;
let current_pos10 = 1;

function un_finalize(word) {
    return Array.from(word).map(function (letter) {
        if (FINAL_LETTERS.hasOwnProperty(letter))
            return FINAL_LETTERS[letter];
        else
            return letter;
    }).join('');
}

function get_matches(guess, truth) {
    guess = un_finalize(guess);
    truth = un_finalize(truth);

    const not_exact_matches = [];
    for (let i = 0; i < 5; i++)
        if (guess[i] !== truth[i])
            not_exact_matches.push(truth[i]);

    const matches = [];
    for (let i = 0; i < 5; i++) {
        if (guess[i] === truth[i]) {
            matches.push('exact');
            continue;
        }
        const index = not_exact_matches.indexOf(guess[i]);
        if (index === -1) {
            matches.push('wrong');
        } else {
            not_exact_matches.splice(index, 1);
            matches.push('other');
        }
    }
    return matches;
}

function create_result() {
    const RTL_MARK = '\u200f';
    const rows = guesses.map(function (guess) {
        return RTL_MARK + get_matches(guess, word_of_the_day).map(function (match) {
            return {
                exact: '🟩',
                other: '🟨',
                wrong: '⬜'
            } [match];
        }).join('');
    });
    let score = guesses[guesses.length - 1] === word_of_the_day ? `${guesses.length}/6` : 'X/6';
    if (localStorage.getItem('difficulty') === 'hard')
        score += '*';
    return `מדויקת ${today} - ${score}\n\n` + rows.join('\n');
}

function create_resultEx(number) {
    const RTL_MARK = '\u200f';
    const rows = eval(`guesses${number}`).map(function (guess) {
        return RTL_MARK + get_matches(guess, eval(`word_of_the_day${number}`)).map(function (match) {
            return {
                exact: '🟩',
                other: '🟨',
                wrong: '⬜'
            } [match];
        }).join('');
    });
    let score = eval(`guesses${number}`)[eval(`guesses${number}`).length - 1] === eval(`word_of_the_day${number}`) ? `${eval(`guesses${number}`).length}/6` : 'X/6';
    if (localStorage.getItem('difficulty') === 'hard')
        score += '*';
    return `מדויקת ${today} - ${score}\n\n` + rows.join('\n');
}


function set_modal_state() {
    switch (history.state) {
        case 'help':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.remove('hidden');
            document.getElementById('help-screen').scrollTop = 0;
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            countdown();
            break;

        case 'settings':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.remove('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            break;

        case 'success':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.remove('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            fill_success_details();
            //            load_from_local_storage()
            break;
        case 'finish':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.remove('hidden');
            //fill_finish_details();
            countdown();
            break;
        default:
            document.getElementById('modal').classList.add('hidden');
    }
}

function set_modal_stateEx(number) {
    switch (history.state) {
        case 'help':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.remove('hidden');
            document.getElementById('help-screen').scrollTop = 0;
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            countdown();
            break;

        case 'settings':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.remove('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            break;

        case 'success':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.remove('hidden');
            document.getElementById('finish-screen').classList.add('hidden');
            fill_success_detailsEx(number);
            //countdown();
            //            load_from_local_storage()
            break;
        case 'finish':
            document.getElementById('modal').classList.remove('hidden');
            document.getElementById('help-screen').classList.add('hidden');
            document.getElementById('settings-screen').classList.add('hidden');
            document.getElementById('success-screen').classList.add('hidden');
            document.getElementById('finish-screen').classList.remove('hidden');
            //fill_finish_details();
            countdown();
            break;
        default:
            document.getElementById('modal').classList.add('hidden');
    }
}


function show_help() {
    if (history.state !== 'help') {
        if (history.state === 'settings' || history.state === 'success')
            history.replaceState('help', '');
        else
            history.pushState('help', '');
    }
    set_modal_state();
}

function clear_history() {

    localStorage.removeItem('finished')
    localStorage.removeItem('finished2')
    localStorage.removeItem('finished3')
    localStorage.removeItem('finished4')
    localStorage.removeItem('finished5')
    localStorage.removeItem('finished6')
    localStorage.removeItem('finished7')
    localStorage.removeItem('finished8')
    localStorage.removeItem('finished9')
    localStorage.removeItem('finished10')

    localStorage.removeItem('guesses')
    localStorage.removeItem('guesses2')
    localStorage.removeItem('guesses3')
    localStorage.removeItem('guesses4')
    localStorage.removeItem('guesses5')
    localStorage.removeItem('guesses6')
    localStorage.removeItem('guesses7')
    localStorage.removeItem('guesses8')
    localStorage.removeItem('guesses9')
    localStorage.removeItem('guesses10')

    localStorage.removeItem('results')
    localStorage.removeItem('results2')
    localStorage.removeItem('results3')
    localStorage.removeItem('results4')
    localStorage.removeItem('results5')
    localStorage.removeItem('results6')
    localStorage.removeItem('results7')
    localStorage.removeItem('results8')
    localStorage.removeItem('results9')
    localStorage.removeItem('results10')

    location.reload();
}

function show_settings() {
    if (history.state !== 'settings') {
        if (history.state === 'help' || history.state === 'success' || history.state === 'finish')
            history.replaceState('settings', '');
        else
            history.pushState('settings', '');
    }
    set_modal_state();
}

function show_success_screen() {
    if (history.state !== 'success') {
        if (history.state === 'help' || history.state === 'settings' || history.state === 'finish')
            history.replaceState('success', '');
        else
            history.pushState('success', '');
    }
    set_modal_state();
}

function show_success_screenEx(number) {
    if (history.state !== 'success') {
        if (history.state === 'help' || history.state === 'settings' || history.state === 'finish')
            history.replaceState('success', '');
        else
            history.pushState('success', '');
    }
    set_modal_stateEx(number);
}

function show_finish_screen() {
    if (history.state !== 'finish') {
        if (history.state === 'help' || history.state === 'settings' || history.state === 'success')
            history.replaceState('finish', '');
        else
            history.pushState('finish', '');
    }
    set_modal_state();
}

function apply_setting(name, value) {
    switch (name) {
        case 'difficulty':
            if (value === 'normal')
                localStorage.setItem('difficulty', 'normal');
            else
                localStorage.setItem('difficulty', 'hard');
            break;

        case 'color-scheme':
            if (value === 'pastel') {
                document.body.classList.remove('colorblind');
                localStorage.setItem('colorblind', 'no');
            } else {
                document.body.classList.add('colorblind');
                localStorage.setItem('colorblind', 'yes');
            }
            break;
    }
}

function copy_result(event) {
    event.stopPropagation();

    window.getSelection().selectAllChildren(document.getElementById('result'));

    const result = create_result() + '\n\nhttps://meduyeket.net';
    navigator.clipboard.writeText(result)
        .then(function () {
            if (navigator.canShare && !navigator.userAgent.includes('Firefox') && !(navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrom') && !navigator.userAgent.includes('Mobile')) && navigator.canShare({
                    text: result
                })) {
                navigator.share({
                    text: result
                }).catch(function () {
                    popup('התוצאה הועתקה, אפשר להדביק עם Ctrl+V');
                });
            } else {
                popup('התוצאה הועתקה, אפשר להדביק עם Ctrl+V');
            }
        })
        .catch(function () {
            if (navigator.canShare && !navigator.userAgent.includes('Firefox') && !(navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrom') && !navigator.userAgent.includes('Mobile')) && navigator.canShare({
                    text: result
                })) {
                navigator.share({
                    text: result
                }).catch(function () {
                    if (event.target.id !== 'result')
                        popup('לא עבד, נסו להעתיק את הטקסט ידנית');
                });
            } else {
                if (event.target.id !== 'result')
                    popup('לא עבד, נסו להעתיק את הטקסט ידנית');
            }
        });
}

function fill_success_details() {

    if (localStorage.getItem('finished') === 'yes') {
        document.getElementById('spoiler').classList.remove('hidden');
        document.getElementById('result-container').classList.remove('hidden');

        if (guesses[guesses.length - 1] === word_of_the_day) {
            document.getElementById('success-header').innerText = 'כל הכבוד!';
            document.getElementById('spoiler').classList.add('hidden');
        } else {
            document.getElementById('success-header').innerText = 'לא הצליח הפעם';
            document.getElementById('spoiler').classList.remove('hidden');
            document.getElementById('spoiler-word').innerText = word_of_the_day;
        }

        document.getElementById('result').innerHTML = create_result();

    } else {
        document.getElementById('spoiler').classList.add('hidden');
        document.getElementById('result-container').classList.add('hidden');
    }

    let all_results1 = JSON.parse(localStorage.getItem('results'));
    let all_results2 = JSON.parse(localStorage.getItem('results2'));
    let all_results3 = JSON.parse(localStorage.getItem('results3'));
    let all_results4 = JSON.parse(localStorage.getItem('results4'));
    let all_results5 = JSON.parse(localStorage.getItem('results5'));
    let all_results6 = JSON.parse(localStorage.getItem('results6'));
    let all_results7 = JSON.parse(localStorage.getItem('results7'));
    let all_results8 = JSON.parse(localStorage.getItem('results8'));
    let all_results9 = JSON.parse(localStorage.getItem('results9'));
    let all_results10 = JSON.parse(localStorage.getItem('results10'));

    let all_results = []
    all_results = all_results1.concat(all_results2, all_results3, all_results4, all_results5, all_results6, all_results7, all_results8, all_results9, all_results10)

    document.getElementById('stats-games').innerText = all_results.length;
    let wins = 0,
        streak = 0,
        max_streak = 0,
        avg = 0;
    let histogram = [0, 0, 0, 0, 0, 0, 0];
    for (const result of all_results) {
        if (result === 'X') {
            streak = 0;
        } else {
            wins++;
            streak++;
            max_streak = Math.max(streak, max_streak);
            histogram[result] += 1;
        }
    }
    document.getElementById('stats-success').innerText = all_results.length > 0 ? Math.round(100 * wins / all_results.length) : 0;
    document.getElementById('stats-streak').innerText = streak;
    //    document.getElementById('stats-max-streak').innerText = max_streak;

    const hist_max = Math.max(1, Math.max(...histogram));
    const num_guesses = (localStorage.getItem('finished') === 'yes') ? guesses.length : 0;
    for (let i = 1; i <= 6; i++) {
        const elt = document.getElementById(`histogram-${i}`);
        if (i === num_guesses)
            elt.setAttribute('match', 'exact');
        else
            elt.setAttribute('match', 'wrong');
        elt.style.width = `calc(${3 + 77 * histogram[i] / hist_max} * var(--unit))`;
        elt.innerText = histogram[i];
        avg += i * histogram[i];
    }


    document.getElementById('stats-max-streak').innerText = (avg / wins).toFixed(1);

}

function fill_success_detailsEx(number) {

    if (localStorage.getItem(`finished${number}`) === 'yes') {
        document.getElementById('spoiler').classList.remove('hidden');
        document.getElementById('result-container').classList.remove('hidden');

        if (eval(`guesses${number}`)[eval(`guesses${number}`).length - 1] === eval(`word_of_the_day${number}`)) {
            document.getElementById('success-header').innerText = 'כל הכבוד!';
            document.getElementById('spoiler').classList.add('hidden');
        } else {
            document.getElementById('success-header').innerText = 'לא הצליח הפעם';
            document.getElementById('spoiler').classList.remove('hidden');
            document.getElementById('spoiler-word').innerText = eval(`word_of_the_day${number}`);
        }

        document.getElementById("result").innerHTML = create_resultEx(number);


    } else {
        document.getElementById('spoiler').classList.add('hidden');
        document.getElementById('result-container').classList.add('hidden');
    }

    let all_results1 = JSON.parse(localStorage.getItem('results'));
    let all_results2 = JSON.parse(localStorage.getItem('results2'));
    let all_results3 = JSON.parse(localStorage.getItem('results3'));
    let all_results4 = JSON.parse(localStorage.getItem('results4'));
    let all_results5 = JSON.parse(localStorage.getItem('results5'));
    let all_results6 = JSON.parse(localStorage.getItem('results6'));
    let all_results7 = JSON.parse(localStorage.getItem('results7'));
    let all_results8 = JSON.parse(localStorage.getItem('results8'));
    let all_results9 = JSON.parse(localStorage.getItem('results9'));
    let all_results10 = JSON.parse(localStorage.getItem('results10'));

    let all_results = []
    all_results = all_results1.concat(all_results2, all_results3, all_results4, all_results5, all_results6, all_results7, all_results8, all_results9, all_results10)

    document.getElementById('stats-games').innerText = all_results.length;
    let wins = 0,
        streak = 0,
        max_streak = 0;
    let histogram = [0, 0, 0, 0, 0, 0, 0];
    for (const result of all_results) {
        if (result === 'X') {
            streak = 0;
        } else {
            wins++;
            streak++;
            max_streak = Math.max(streak, max_streak);
            histogram[result] += 1;
        }
    }



    document.getElementById('stats-success').innerText = all_results.length > 0 ? Math.round(100 * wins / all_results.length) : 0;
    document.getElementById('stats-streak').innerText = streak;
    document.getElementById('stats-max-streak').innerText = max_streak;

    const hist_max = Math.max(1, Math.max(...histogram));
    const num_guesses = (localStorage.getItem(`finished${number}`) === 'yes') ? eval(`guesses${number}`).length : 0;
    for (let i = 1; i <= 6; i++) {
        const elt = document.getElementById(`histogram-${i}`);
        if (i === num_guesses)
            elt.setAttribute('match', 'exact');
        else
            elt.setAttribute('match', 'wrong');
        elt.style.width = `calc(${3 + 77 * histogram[i] / hist_max} * var(--unit))`;
        elt.innerText = histogram[i];
    }
}

function fill_finish_details() {

    if (localStorage.getItem('finished') === 'yes') {
        document.getElementById('spoiler').classList.remove('hidden');
        document.getElementById('result-container').classList.remove('hidden');

        if (guesses[guesses.length - 1] === word_of_the_day) {
            document.getElementById('success-header').innerText = 'כל הכבוד!';
            document.getElementById('spoiler').classList.add('hidden');
        } else {
            document.getElementById('success-header').innerText = 'לא הצליח הפעם';
            document.getElementById('spoiler').classList.remove('hidden');
            document.getElementById('spoiler-word').innerText = word_of_the_day;
        }

        document.getElementById('result').innerHTML = create_result();
    } else {
        document.getElementById('spoiler').classList.add('hidden');
        document.getElementById('result-container').classList.add('hidden');
    }

    let all_results = JSON.parse(localStorage.getItem('results'));

    document.getElementById('stats-games').innerText = all_results.length;
    let wins = 0,
        streak = 0,
        max_streak = 0;
    let histogram = [0, 0, 0, 0, 0, 0, 0];
    for (const result of all_results) {
        if (result === 'X') {
            streak = 0;
        } else {
            wins++;
            streak++;
            max_streak = Math.max(streak, max_streak);
            histogram[result] += 1;
        }
    }
    document.getElementById('stats-success').innerText = all_results.length > 0 ? Math.round(100 * wins / all_results.length) : 0;
    document.getElementById('stats-streak').innerText = streak;
    document.getElementById('stats-max-streak').innerText = max_streak;

    const hist_max = Math.max(1, Math.max(...histogram));
    const num_guesses = (localStorage.getItem('finished') === 'yes') ? guesses.length : 0;
    for (let i = 1; i <= 6; i++) {
        const elt = document.getElementById(`histogram-${i}`);
        if (i === num_guesses)
            elt.setAttribute('match', 'exact');
        else
            elt.setAttribute('match', 'wrong');
        elt.style.width = `calc(${3 + 77 * histogram[i] / hist_max} * var(--unit))`;
        elt.innerText = histogram[i];
    }
}

function countdown() {
    if (document.getElementById('modal').classList.contains('hidden'))
        return;
    /* if (document.getElementById('finish-screen').classList.contains('hidden'))
      return;*/

    if (get_date() === today) {
        document.getElementById('countdown_help').classList.remove('hidden');
        document.getElementById('restart-button').classList.add('hidden');
    } else {
        document.getElementById('countdown-header').innerText = 'המילה הבאה מוכנה';
        document.getElementById('countdown_help').classList.add('hidden');
        document.getElementById('restart-button').classList.remove('hidden');
        document.getElementById('countdown-container').style.cursor = 'pointer';
        document.getElementById('countdown-container').addEventListener('click', function () {
            history.replaceState('app', '');
            location.reload();
        });
        return;
    }

    const time_str = new Date().toLocaleTimeString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        hourCycle: 'h23'
    });
    const [hours, minutes, seconds] = time_str.split(':').map(function (x) {
        return parseInt(x);
    });
    const since_midnight = 3600 * hours + 60 * minutes + seconds;
    const to_midnight = 3600 * 24 - since_midnight;
    document.getElementById('countdown_help').innerText =
        `${Math.trunc(to_midnight / 3600)}:${two_digits((to_midnight % 3600) / 60)}:${two_digits(to_midnight % 60)}`;
    window.setTimeout(countdown, 1000 - new Date().getMilliseconds());
}

function two_digits(x) {
    x = Math.trunc(x);
    if (x < 10)
        return '0' + x.toString();
    else
        return x.toString();
}

function hide_modal() {
    if (history.state === 'help' || history.state === 'settings' || history.state === 'success' || history.state === 'finish')
        history.replaceState('app', '');
    set_modal_state();
    load_from_local_storage(false);
}

function popup(text) {
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popup').innerText = text;
    window.setTimeout(function () {
        document.getElementById('popup').classList.add('hidden');
    }, 1500);
}

function type_letter(letter, number) {
    const row = guesses.length + 1;
    //for (let i = 1; i <= 5; i++) {
    let elt = document.getElementById(`letter-${row}-${current_pos1}`);
    //if (elt.innerText === '') {
    elt.classList.add('typed');
    if (current_pos1 === 5 && FINALED_LETTERS.hasOwnProperty(letter)) {
        let previous = '';
        for (let j = 1; j <= 4; j++)
            previous += document.getElementById(`letter-${row}-${j}`).innerText;
        if (WORDS.has(previous + letter))
            elt.innerText = letter;
        else
            elt.innerText = FINALED_LETTERS[letter];
    } else
        elt.innerText = letter;

    elt = document.getElementById(`letter-${row}-${current_pos1}`);
    elt.classList.remove('current_letter');
    elt.classList.add('letter');

    if (current_pos1 != 5) {
        elt = document.getElementById(`letter-${row}-${++current_pos1}`);
        elt.classList.remove('letter');
        elt.classList.add('current_letter');
    }
    //break;
    //}
    //}
}

function type_letterEx(letter, number) {
    const row = eval(`guesses${number}.length + 1`)
    //for (let i = 1; i <= 5; i++) {
    let elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
    //if (elt.innerText === '') {
    elt.classList.add('typed');
    if (eval(`current_pos${number}`) === 5 && FINALED_LETTERS.hasOwnProperty(letter)) {
        let previous = '';
        for (let j = 1; j <= 4; j++)
            previous += document.getElementById(`letter${number}-${row}-${j}`).innerText;
        if (WORDS.has(previous + letter))
            elt.innerText = letter;
        else
            elt.innerText = FINALED_LETTERS[letter];
    } else
        elt.innerText = letter;

    elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
    elt.classList.remove('current_letter');
    elt.classList.add('letter');

    if (eval(`current_pos${number}`) != 5) {
        eval(`current_pos${number}++`);
        elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
        elt.classList.remove('letter');
        elt.classList.add('current_letter');
    }
    //break;
    //}
    //}
}


function erase_letter() {
    const row = guesses.length + 1;
    for (let i = 5; i >= 1; i--) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        if (elt.innerText !== '') {
            elt.classList.remove('typed');
            elt.innerText = '';
            break;
        }
    }

    if (current_pos1 != 1) {
        let elt = document.getElementById(`letter-${row}-${current_pos1}`);
        elt.classList.remove('current_letter');
        elt.classList.add('letter');

        elt = document.getElementById(`letter-${row}-${--current_pos1}`);
        elt.classList.remove('letter');
        elt.classList.add('current_letter');
    }
}

function erase_letterEx(number) {
    const row = eval(`guesses${number}.length + 1`)
    for (let i = 5; i >= 1; i--) {
        const elt = document.getElementById(`letter${number}-${row}-${i}`);
        if (elt.innerText !== '') {
            elt.classList.remove('typed');
            elt.innerText = '';
            break;
        }
    }

    if (eval(`current_pos${number}`) != 1) {
        let elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
        elt.classList.remove('current_letter');
        elt.classList.add('letter');

        eval(`current_pos${number}--`);
        elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
        elt.classList.remove('letter');
        elt.classList.add('current_letter');
    }
}

function make_guess() {
    const row = guesses.length + 1;
    let guess = '';
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        guess += elt.innerText;
    }

    let err = null;
    if (guess.length < 5)
        err = 'אין מספיק אותיות';
    else if (!WORDS.has(guess))
        err = 'לא ברשימת המילים';
    else if ((localStorage.getItem('difficulty') === 'hard') && !is_compatible_with_hints(guess))
        err = 'חובה להשתמש בכל הרמזים';

    if (err !== null) {
        const row_elt = document.getElementById(`guess-${row}`);
        row_elt.classList.add('jiggle');
        window.setTimeout(function () {
            row_elt.classList.remove('jiggle');
        }, 2000);
        popup(err);
        return;
    }

    let elt = 0
    if (row != 1) {
        elt = document.getElementById(`letter-1-5`);
        elt.classList.remove('current_letter');
        elt.classList.add('letter');
    }


    const matches = get_matches(guess, word_of_the_day);
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter-${row}-${i}`);
        elt.classList.remove('typed');
        elt.classList.add('flipping');
        (function(el, matchVal, delay) {
            window.setTimeout(function() { el.setAttribute('match', matchVal); }, delay);
        })(elt, matches[i - 1], (i - 1) * 150 + 250);
    }
    guesses.push(guess);
    localStorage.setItem(`guesses`, JSON.stringify(guesses));
    if (guess === word_of_the_day) {
        add_result_to_local_storage();
        window.setTimeout(function() {
            const row_elt = document.getElementById(`guess-${row}`);
            row_elt.classList.add('win');
        }, 900);
        const CONGRATULATIONS = ['גאוני', 'מדהים', 'נפלא', 'סחתיין', 'נהדר', 'מקסים'];
        popup(CONGRATULATIONS[guesses.length - 1]);
        window.setTimeout(show_success_screen, 3600);
    } else {
        window.setTimeout(set_keyboard_key_colors, 900);
        if (guesses.length === 6) {
            add_result_to_local_storage();
            window.setTimeout(show_success_screen, 2000);
        }

        if (row != 6) {
            current_pos1 = 1;
            window.setTimeout(function() {
                elt = document.getElementById(`letter-${row+1}-1`);
                elt.classList.remove('letter');
                elt.classList.add('current_letter');
            }, 900);
        }
    }
}

function make_guessEx(number) {
    const row = eval(`guesses${number}.length + 1`)
    let guess = '';
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter${number}-${row}-${i}`);
        guess += elt.innerText;
    }

    let err = null;
    if (guess.length < 5)
        err = 'אין מספיק אותיות';
    else if (!WORDS.has(guess))
        err = 'לא ברשימת המילים';
    else if ((localStorage.getItem('difficulty') === 'hard') && !is_compatible_with_hints(guess))
        err = 'חובה להשתמש בכל הרמזים';

    if (err !== null) {
        const row_elt = document.getElementById(`guess${number}-${row}`);
        row_elt.classList.add('jiggle');
        window.setTimeout(function () {
            row_elt.classList.remove('jiggle');
        }, 2000);
        popup(err);
        return;
    }

    let elt = 0
    if (row != 1) {
        elt = document.getElementById(`letter${number}-${row-1}-5`);
        elt.classList.remove('current_letter');
        elt.classList.add('letter');
    }


    const matches = get_matches(guess, eval(`word_of_the_day${number}`), number);
    for (let i = 1; i <= 5; i++) {
        const elt = document.getElementById(`letter${number}-${row}-${i}`);
        elt.classList.remove('typed');
        elt.classList.add('flipping');
        (function(el, matchVal, delay) {
            window.setTimeout(function() { el.setAttribute('match', matchVal); }, delay);
        })(elt, matches[i - 1], (i - 1) * 150 + 250);
    }
    eval(`guesses${number}`).push(guess);
    localStorage.setItem(`guesses${number}`, JSON.stringify(eval(`guesses${number}`)));
    if (guess === eval(`word_of_the_day${number}`)) {
        add_result_to_local_storageEx(number);
        window.setTimeout(function() {
            const row_elt = document.getElementById(`guess${number}-${row}`);
            row_elt.classList.add('win');
        }, 900);
        const CONGRATULATIONS = ['גאוני', 'מדהים', 'נפלא', 'סחתיין', 'נהדר', 'מקסים'];
        popup(CONGRATULATIONS[eval(`guesses${number}`).length - 1]);
        window.setTimeout(show_success_screenEx(number), 3600);
    } else {
        window.setTimeout(set_keyboard_key_colorsEx(number), 900);
        if (eval(`guesses${number}`).length === 6) {
            add_result_to_local_storageEx(number);
            window.setTimeout(show_success_screenEx(number), 2000);
        }


        if (row != 6) {
            eval(`current_pos${number} = 1`)
            window.setTimeout(function() {
                elt = document.getElementById(`letter${number}-${row+1}-1`);
                elt.classList.remove('letter');
                elt.classList.add('current_letter');
            }, 900);
        }
    }
}

function count_letters(word) {
    let count = {};
    for (const letter of word) {
        if (!count.hasOwnProperty(letter))
            count[letter] = 0;
        count[letter]++;
    }
    return count;
}

function is_compatible_with_hints(word) {
    const meduyeket = un_finalize(word_of_the_day);
    word = un_finalize(word);

    for (const guess of guesses.map(un_finalize)) {
        const matches = get_matches(guess, meduyeket);
        let letters = {};
        for (let i = 0; i < 5; i++) {
            if (!letters.hasOwnProperty(guess[i]))
                letters[guess[i]] = {
                    required_positions: [],
                    min_count: 0,
                    has_wrong: false,
                    forbidden_positions: []
                };

            switch (matches[i]) {
                case 'exact':
                    letters[guess[i]].required_positions.push(i);
                    letters[guess[i]].min_count++;
                    break;

                case 'other':
                    letters[guess[i]].min_count++;
                    letters[guess[i]].forbidden_positions.push(i);
                    break;

                case 'wrong':
                    letters[guess[i]].has_wrong = true;
                    break;
            }
        }

        for (const [letter, info] of Object.entries(letters)) {
            let count = 0;
            for (let i = 0; i < 5; i++) {
                if (word[i] === letter) {
                    count++;
                    if (info.forbidden_positions.includes(i))
                        return false;
                } else {
                    if (info.required_positions.includes(i))
                        return false;
                }
            }
            if (count < info.min_count)
                return false;
            if (info.has_wrong && count > info.min_count)
                return false;
        }
    }

    return true;
}

function set_keyboard_key_colors() {
    let letter_states = {};
    for (const guess of guesses) {
        if (guess !== word_of_the_day) {
            const matches = get_matches(guess, word_of_the_day);
            for (let i = 0; i < 5; i++) {
                let letter = guess[i];
                if (FINAL_LETTERS.hasOwnProperty(letter))
                    letter = FINAL_LETTERS[letter];

                if (matches[i] === 'exact')
                    letter_states[letter] = 'exact';
                else if (matches[i] === 'other' && letter_states[letter] !== 'exact')
                    letter_states[letter] = 'other';
                else if (matches[i] === 'wrong' && !letter_states.hasOwnProperty(letter))
                    letter_states[letter] = 'wrong';
            }
        }
    }
    for (const elt of document.getElementsByClassName('key'))
        if (letter_states.hasOwnProperty(elt.innerText))
            elt.setAttribute('match', letter_states[elt.innerText]);
}

function set_keyboard_key_colorsEx(number) {
    let letter_states = {};
    for (const guess of eval(`guesses${number}`)) {
        if (guess !== eval(`word_of_the_day${number}`)) {
            const matches = get_matches(guess, eval(`word_of_the_day${number}`));
            for (let i = 0; i < 5; i++) {
                let letter = guess[i];
                if (FINAL_LETTERS.hasOwnProperty(letter))
                    letter = FINAL_LETTERS[letter];

                if (matches[i] === 'exact')
                    letter_states[letter] = 'exact';
                else if (matches[i] === 'other' && letter_states[letter] !== 'exact')
                    letter_states[letter] = 'other';
                else if (matches[i] === 'wrong' && !letter_states.hasOwnProperty(letter))
                    letter_states[letter] = 'wrong';
            }
        }
    }


    let keys = document.getElementsByClassName(`key${number}`)
    for (const elt of keys)
        if (letter_states.hasOwnProperty(elt.innerText))
            elt.setAttribute('match', letter_states[elt.innerText]);
}


function handle_key(key) {
    if (localStorage.getItem('finished') === 'yes')
        return;

    else if (key === 'Backspace')
        erase_letter();
    else if (key === 'Enter')
        make_guess();
    else if (HEBREW_KEYMAP.hasOwnProperty(key))
        type_letter(HEBREW_KEYMAP[key]);
}

function handle_keyEx(key, number) {
    if (localStorage.getItem(`finished${number}`) === 'yes')
        return;

    else if (key === 'Backspace')
        erase_letterEx(number);
    else if (key === 'Enter')
        make_guessEx(number);
    else if (HEBREW_KEYMAP.hasOwnProperty(key))
        type_letterEx(HEBREW_KEYMAP[key], number);
}


function handle_on_screen_keyboard_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_key(event.currentTarget.getAttribute('value'));
    else
        handle_key(event.currentTarget.innerText);
}

function handle_on_screen_keyboard2_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 2);
    else
        handle_keyEx(event.currentTarget.innerText, 2);
}

function handle_on_screen_keyboard3_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 3);
    else
        handle_keyEx(event.currentTarget.innerText, 3);
}

function handle_on_screen_keyboard4_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 4);
    else
        handle_keyEx(event.currentTarget.innerText, 4);
}

function handle_on_screen_keyboard5_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 5);
    else
        handle_keyEx(event.currentTarget.innerText, 5);
}

function handle_on_screen_keyboard6_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 6);
    else
        handle_keyEx(event.currentTarget.innerText, 6);
}

function handle_on_screen_keyboard7_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 7);
    else
        handle_keyEx(event.currentTarget.innerText, 7);
}

function handle_on_screen_keyboard8_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 8);
    else
        handle_keyEx(event.currentTarget.innerText, 8);
}

function handle_on_screen_keyboard9_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 9);
    else
        handle_keyEx(event.currentTarget.innerText, 9);
}

function handle_on_screen_keyboard10_click(event) {
    if (event.currentTarget.classList.contains('wide'))
        handle_keyEx(event.currentTarget.getAttribute('value'), 10);
    else
        handle_keyEx(event.currentTarget.innerText, 10);
}

function handle_on_screen_click(pos, event) {
    const row = guesses.length + 1;

    let elt = document.getElementById(`letter-${row}-${pos}`);

    //if (elt.innerText != '') {
    elt.innerText = '';

    elt = document.getElementById(`letter-${row}-${eval(`current_pos1`)}`);
    elt.classList.remove('current_letter');
    elt.classList.add('letter');

    current_pos1 = pos;
    elt = document.getElementById(`letter-${row}-${eval(`current_pos1`)}`);
    elt.classList.remove('letter');
    elt.classList.add('current_letter');
    //}
}

function handle_on_screen_clickEx(number, pos, event) {
    const row = eval(`guesses${number}.length + 1`);

    let elt = document.getElementById(`letter${number}-${row}-${pos}`);
    //if (elt.innerText != '') {
    elt.innerText = '';

    elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
    elt.classList.remove('current_letter');
    elt.classList.add('letter');

    eval(`current_pos${number} = ${pos}`);
    elt = document.getElementById(`letter${number}-${row}-${eval(`current_pos${number}`)}`);
    elt.classList.remove('letter');
    elt.classList.add('current_letter');
    //}
}


function add_result_to_local_storage() {
    localStorage.setItem('finished', 'yes');

    let results = JSON.parse(localStorage.getItem('results'));
    results.push(guesses[guesses.length - 1] === word_of_the_day ? guesses.length : 'X');
    localStorage.setItem('results', JSON.stringify(results));
}

function add_result_to_local_storageEx(number) {
    localStorage.setItem(`finished${number}`, 'yes');

    let results = JSON.parse(localStorage.getItem(`results${number}`));
    results.push((eval(`guesses${number}`)[eval(`guesses${number}`).length - 1] === eval(`word_of_the_day${number}`)) ? eval(`guesses${number}`).length : 'X');
    localStorage.setItem(`results${number}`, JSON.stringify(results));
}


function load_from_local_storage(hide) {

    WORDS_NO_REPEAT.forEach(element => console.log(element));

    const first_time = !localStorage.getItem('date');
    const new_day = localStorage.getItem('date') !== today;

    const finished_today = localStorage.getItem('finished') === 'yes';

    const finished_today2 = localStorage.getItem('finished2') === 'yes';
    const finished_today3 = localStorage.getItem('finished3') === 'yes';
    const finished_today4 = localStorage.getItem('finished4') === 'yes';
    const finished_today5 = localStorage.getItem('finished5') === 'yes';
    const finished_today6 = localStorage.getItem('finished6') === 'yes';
    const finished_today7 = localStorage.getItem('finished7') === 'yes';
    const finished_today8 = localStorage.getItem('finished8') === 'yes';
    const finished_today9 = localStorage.getItem('finished9') === 'yes';
    const finished_today10 = localStorage.getItem('finished10') === 'yes';


    if (localStorage.getItem('date') !== today)
        localStorage.setItem('date', today);

    if (!localStorage.getItem('guesses'))
        localStorage.setItem('guesses', '[]');

    guesses = JSON.parse(localStorage.getItem('guesses'));

    if (localStorage.getItem('finished') !== 'yes')
        localStorage.setItem('finished', 'no');

    if (!localStorage.getItem('results'))
        localStorage.setItem('results', '[]');

    if (finished_today) {
        let elemKeyboard = document.getElementById(`game`)
        elemKeyboard.classList.add('game-finished')
    }

    for (let g = 2; g <= 10; g++) {
        if (!localStorage.getItem(eval(`'guesses${g}'`)))
            localStorage.setItem(eval(`'guesses${g}'`), '[]');

        eval(`guesses${g} = JSON.parse(localStorage.getItem('guesses${g}'))`);

        if (localStorage.getItem(eval(`'finished${g}'`)) !== 'yes')
            localStorage.setItem(eval(`'finished${g}'`), 'no');

        if (!localStorage.getItem(eval(`'results${g}'`)))
            localStorage.setItem(eval(`'results${g}'`), '[]');

        if (eval(`finished_today${g}`)) {
            var elemKeyboard = document.getElementById(eval(`'game${g}'`));
            elemKeyboard.classList.add('game-finished');
        }

    }


    if (localStorage.getItem('colorblind') === 'yes') {
        document.body.classList.add('colorblind');
        document.querySelector('input[type="radio"][name="color-scheme"][value="high-contrast"]').checked = true;
    } else {
        localStorage.setItem('colorblind', 'no');
        document.body.classList.remove('colorblind');
        document.querySelector('input[type="radio"][name="color-scheme"][value="pastel"]').checked = true;
    }

    if (localStorage.getItem('difficulty') === 'hard') {
        document.querySelector('input[type="radio"][name="difficulty"][value="hard"]').checked = true;
    } else {
        localStorage.setItem('difficulty', 'normal');
        document.querySelector('input[type="radio"][name="difficulty"][value="normal"]').checked = true;
    }
    if (first_time) {
        show_help();
    } else if (new_day) {
        localStorage.setItem('date', today);
        localStorage.setItem('guesses', '[]');
        localStorage.setItem('finished', 'no');
        guesses = [];

        for (let g = 2; g <= 10; g++) {
            localStorage.setItem(eval(`'guesses${g}'`), '[]');
            localStorage.setItem(eval(`'finished${g}'`), 'no');
            eval(`guesses${g} = []`);
        }
        hide_modal();
    } else {
        for (let i = 0; i < guesses.length; i++) {
            const guess = guesses[i];
            const matches = get_matches(guess, word_of_the_day);
            for (let j = 0; j < 5; j++) {
                const elt = document.getElementById(`letter-${i+1}-${j+1}`);
                elt.setAttribute('match', matches[j]);
                elt.innerText = guess[j];
            }
        }

        if (guesses.length < 6 && !finished_today) {
            const row = guesses.length + 1;
            const elt = document.getElementById(`letter-${row}-${current_pos1}`);
            if (elt.innerText === '') {
                elt.classList.remove('letter');
                elt.classList.add('current_letter');
            }
        }

        for (let g = 2; g <= 10; g++) {

            for (let i = 0; i < eval(`guesses${g}.length`); i++) {
                const guess = eval(`guesses${g}[i]`);
                const matches = get_matches(guess, eval(`word_of_the_day${g}`));
                for (let j = 0; j < 5; j++) {
                    const elt = document.getElementById(`letter${g}-${i+1}-${j+1}`);
                    elt.setAttribute('match', matches[j]);
                    elt.innerText = guess[j];
                }
            }

            if (eval(`guesses${g}.length`).length < 6 && eval(`!finished_today${g}`)) {
                const row = eval(`guesses${g}.length + 1`);
                const elt = document.getElementById(`letter${g}-${row}-${eval(`current_pos${g}`)}`);
                if (elt.innerText === '') {
                    elt.classList.remove('letter');
                    elt.classList.add('current_letter');
                }
            }

        }



        set_keyboard_key_colors();
        for (let g = 2; g <= 10; g++) {
            set_keyboard_key_colorsEx(g);
        }

        if (hide)
            hide_modal();
        if (!(finished_today && finished_today2 && finished_today3 && finished_today4 && finished_today6 && finished_today7 && finished_today8 && finished_today9 && finished_today10)) {
            if (!finished_today) {
                let ele = document.getElementById("game");
                ele.scrollIntoView(true);
            } else if (!finished_today2) {
                let ele = document.getElementById("game2");
                ele.scrollIntoView(true);
            } else if (!finished_today3) {
                let ele = document.getElementById("game3");
                ele.scrollIntoView(true);
            } else if (!finished_today4) {
                let ele = document.getElementById("game4");
                ele.scrollIntoView(true);
            } else if (!finished_today5) {
                let ele = document.getElementById("game5");
                ele.scrollIntoView(true);
            } else if (!finished_today6) {
                let ele = document.getElementById("game6");
                ele.scrollIntoView(true);
            } else if (!finished_today7) {
                let ele = document.getElementById("game7");
                ele.scrollIntoView(true);
            } else if (!finished_today8) {
                let ele = document.getElementById("game8");
                ele.scrollIntoView(true);
            } else if (!finished_today9) {
                let ele = document.getElementById("game9");
                ele.scrollIntoView(true);
            } else if (!finished_today10) {
                let ele = document.getElementById("game10");
                ele.scrollIntoView(true);
            }
        }
    }
}

let previous_adapt_ts = null;

function adapt_to_window_size() {
    window.requestAnimationFrame(function (ts) {
        if (ts === previous_adapt_ts)
            return;

        const unit = Math.min(0.01 * window.innerWidth, 0.006 * window.innerHeight);
        document.documentElement.style.setProperty('--unit', `${unit}px`);
        previous_adapt_ts = ts;
    });
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function add_nodes() {

    for (let g = 2; g <= 10; g++) {
        var new_game = htmlToElement(`<div id="game${g}">
        <div id="header${g}">
            <span id="app-name${g}">מדויקת - ${g}</span>
        </div>
        <div id="guesses${g}">
            <div class="row" id="guess${g}-1">
                <span class="letter" id="letter${g}-1-1"></span>
                <span class="letter" id="letter${g}-1-2"></span>
                <span class="letter" id="letter${g}-1-3"></span>
                <span class="letter" id="letter${g}-1-4"></span>
                <span class="letter" id="letter${g}-1-5"></span>
            </div>
            <div class="row" id="guess${g}-2">
                <span class="letter" id="letter${g}-2-1"></span>
                <span class="letter" id="letter${g}-2-2"></span>
                <span class="letter" id="letter${g}-2-3"></span>
                <span class="letter" id="letter${g}-2-4"></span>
                <span class="letter" id="letter${g}-2-5"></span>
            </div>
            <div class="row" id="guess${g}-3">
                <span class="letter" id="letter${g}-3-1"></span>
                <span class="letter" id="letter${g}-3-2"></span>
                <span class="letter" id="letter${g}-3-3"></span>
                <span class="letter" id="letter${g}-3-4"></span>
                <span class="letter" id="letter${g}-3-5"></span>
            </div>
            <div class="row" id="guess${g}-4">
                <span class="letter" id="letter${g}-4-1"></span>
                <span class="letter" id="letter${g}-4-2"></span>
                <span class="letter" id="letter${g}-4-3"></span>
                <span class="letter" id="letter${g}-4-4"></span>
                <span class="letter" id="letter${g}-4-5"></span>
            </div>
            <div class="row" id="guess${g}-5">
                <span class="letter" id="letter${g}-5-1"></span>
                <span class="letter" id="letter${g}-5-2"></span>
                <span class="letter" id="letter${g}-5-3"></span>
                <span class="letter" id="letter${g}-5-4"></span>
                <span class="letter" id="letter${g}-5-5"></span>
            </div>
            <div class="row" id="guess${g}-6">
                <span class="letter" id="letter${g}-6-1"></span>
                <span class="letter" id="letter${g}-6-2"></span>
                <span class="letter" id="letter${g}-6-3"></span>
                <span class="letter" id="letter${g}-6-4"></span>
                <span class="letter" id="letter${g}-6-5"></span>
            </div>
        </div>
        <div id="keyboard${g}">
            <div class="keyboard-row">
                <span class="key${g}" style="visibility: hidden"></span><span class="key${g} wide" value="Backspace"><svg viewBox="0 0 60 50">
                        <path d="M50,10L20,10L10,25L20,40L50,40L50,10M27,20L37,30M37,20L27,30" fill="none" stroke-width="5" stroke="#EAEDF3" stroke-linecap="square" />
                    </svg></span><span class="key${g}">פ</span><span class="key${g}">ו</span><span class="key${g}">ט</span><span class="key${g}">א</span><span class="key${g}">ר</span><span class="key${g}">ק</span>
            </div>
            <div class="keyboard-row">
                <span class="key${g}" style="visibility: hidden"></span><span class="key${g}">ל</span><span class="key${g}">ח</span><span class="key${g}">י</span><span class="key${g}">ע</span><span class="key${g}">כ</span><span class="key${g}">ג</span><span class="key${g}">ד</span><span class="key${g}">ש</span>
            </div>
            <div class="keyboard-row">
                <span class="key${g} wide" value="Enter">
                    <span>אישור</span>
                    <svg viewBox="0 0 65 50">
                        <path d="M55,15L55,30L10,30L20,20M10,30L20,40" fill="none" stroke-width="5" stroke="#EAEDF3" stroke-linecap="round" stroke-linejoin="round" />
                    </svg></span><span class="key${g}">ת</span><span class="key${g}">צ</span><span class="key${g}">מ</span><span class="key${g}">נ</span><span class="key${g}">ה</span><span class="key${g}">ב</span><span class="key${g}">ס</span><span class="key${g}">ז</span>
            </div>
        </div>
    </div>`);
        document.body.appendChild(new_game);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    add_nodes();
    /*let gB = new gameBoard(2);
    console.log(gB.toString());*/

    load_from_local_storage(true);
    document.getElementById('help-button').addEventListener('click', show_help);
    document.getElementById('success-button').addEventListener('click', show_success_screen);
    document.getElementById('settings-button').addEventListener('click', show_settings);
    document.getElementById('share-button').addEventListener('click', copy_result);
    document.getElementById('restart-button').addEventListener('click', clear_history);
    document.getElementById('modal').addEventListener('click', hide_modal);
    document.body.addEventListener('keydown', function (event) {
        if (event.ctrlKey || event.altKey || event.metaKey)
            return;

        if (event.key === '?')
            show_help();
        else if (event.key === 'Escape')
            hide_modal();
        else
            handle_key(event.key);
    });


    for (const elt of document.getElementsByClassName('key'))
        elt.addEventListener('click', handle_on_screen_keyboard_click);

    for (let g = 2; g <= 10; g++) {
        for (const elt of document.getElementsByClassName(eval(`'key${g}'`)))
            elt.addEventListener('click', eval(`handle_on_screen_keyboard${g}_click`));
    }

    for (let j = 1; j <= 6; j++) {
        for (let k = 1; k <= 5; k++) {
            const elt = document.getElementById(`letter-${j}-${k}`)
            elt.addEventListener('click', (evt) => handle_on_screen_click(eval(`${k}`), evt))
        }
    }


    for (let i = 2; i <= 10; i++) {
        for (let j = 1; j <= 6; j++) {
            for (let k = 1; k <= 5; k++) {
                const elt = document.getElementById(`letter${i}-${j}-${k}`)
                elt.addEventListener('click', (evt) => handle_on_screen_clickEx(eval(`${i}`), eval(`${k}`), evt))
            }
        }
    }

    for (const elt of document.getElementById('settings-screen').querySelectorAll('label'))
        elt.addEventListener('click', function (event) {
            event.stopPropagation();
        });
    document.body.addEventListener('change', function (event) {
        apply_setting(event.target.name, event.target.value);
    });
    set_modal_state();
    window.addEventListener('popstate', set_modal_state);
    //adapt_to_window_size();
    //window.addEventListener('resize', adapt_to_window_size);


});

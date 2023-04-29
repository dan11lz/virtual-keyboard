import eng from './engKeysKit.js';
import ru from './ruKeysKit.js';
import set from './keys.js';

const main = set('main', 'main', [set('h1', 'title', 'Virtual Keyboard')]);

const btnKeys = [];

export default class Keyboard {
  constructor(btnOrder) {
    this.btnOrder = btnOrder;
    this.isActiveCaps = false;
  }

  init() {
    this.description = set(
      'p',
      'description',
      'Keyboard was created on Windows OS',
      main,
    );
    this.description = set(
      'p',
      'description',
      'For language switch use Shift + Alt',
      main,
    );
    this.textarea = set(
      'textarea',
      'textarea',
      '',
      main,
      ['placeholder', '...'],
      ['rows', 5],
      ['cols', 50],
      ['spellcheck', false],
      ['autocorrect', 'off'],
    );
    this.container = set('div', 'keyboard', '', main, ['language', 'en']);
    document.body.prepend(main);
    return this;
  }

  generateKeys(lang) {
    this.lang = lang;
    this.textarea.focus();
    this.btnOrder.forEach((keys) => {
      this.row = set('div', 'row', '', this.container);
      keys.forEach((btn) => {
        this.key = set('div', `key ${btn}`, '', this.row);
        this.keyRu = set('span', 'rus', '', this.key);
        this.keyEng = set('span', 'eng', '', this.key);

        this.keyLowRu = set(
          'span',
          'lower',
          ru.find((e) => e.name === btn).lower,
          this.keyRu,
        );
        this.keyLowEn = set(
          'span',
          'lower',
          eng.find((e) => e.name === btn).lower,
          this.keyEng,
        );
        this.keyUpRu = set(
          'span',
          'upper',
          ru.find((e) => e.name === btn).upper,
          this.keyRu,
        );
        this.keyUpEn = set(
          'span',
          'upper',
          eng.find((e) => e.name === btn).upper,
          this.keyEng,
        );

        if (lang === 'ru') {
          this.keyEng.classList.add('hidden');
          this.keyUpRu.classList.add('hidden');
          this.keyUpEn.classList.add('hidden');
        } else {
          this.keyRu.classList.add('hidden');
          this.keyUpEn.classList.add('hidden');
          this.keyUpRu.classList.add('hidden');
        }
        btnKeys.push(this.key);
      });
    });

    document.addEventListener('keyup', this.handleKeyEvent);
    document.addEventListener('keydown', this.handleKeyEvent);
    document.addEventListener('mousedown', this.handleMouseEvent);
    document.addEventListener('mouseup', this.handleMouseEvent);
  }

  handleKeyEvent = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    event.preventDefault();
    this.textarea.focus();
    let cursor = this.textarea.selectionStart;
    const left = this.textarea.value.slice(0, cursor);
    const right = this.textarea.value.slice(cursor);
    const activeKey = btnKeys.find((e) => e.classList.contains(event.code));

    if (event.type === 'keydown') {
      if (activeKey) activeKey.classList.add('active');
      if (
        event.type.match(/key/)
        && !event.code.match(/Alt|Control|Caps|Shift/)
        && activeKey
      ) {
        if (event.code.match(/Tab/)) {
          this.textarea.value = `${left}    ${right}`;
          cursor += 4;
        } else if (event.code.match(/ArrowLeft/)) {
          cursor = cursor - 1 >= 0 ? cursor - 1 : 0;
        } else if (event.code.match(/ArrowRight/)) {
          cursor += 1;
        } else if (event.code.match(/ArrowUp/)) {
          const posLeft = this.textarea.value
            .slice(0, cursor)
            .match(/(\n).*$(?!\1)/g) || [[1]];
          cursor -= posLeft[0].length;
        } else if (event.code.match(/ArrowDown/)) {
          const posLeft = this.textarea.value
            .slice(0, cursor)
            .match(/(\n).*$(?!\1)/g) || [[1]];
          cursor += posLeft[0].length;
        } else if (event.code.match(/Enter/)) {
          this.textarea.value = `${left}\n${right}`;
          cursor += 1;
        } else if (event.code.match(/Delete/)) {
          this.textarea.value = `${left}${right.slice(1)}`;
        } else if (event.code.match(/Backspace/)) {
          this.textarea.value = `${left.slice(0, -1)}${right}`;
          cursor -= 1;
        } else if (event.code.match(/Space/)) {
          this.textarea.value = `${left} ${right}`;
          cursor += 1;
        } else {
          cursor += 1;
          if (
            !event.code.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Del|Tab/,
            )
          ) {
            if (!activeKey.firstChild.classList.contains('hidden')) {
              if (
                !activeKey.firstChild.firstChild.classList.contains('hidden')
              ) {
                this.textarea.value = `${left}${
                  activeKey.firstChild.firstChild.innerHTML || ''
                }${right}`;
              } else {
                this.textarea.value = `${left}${
                  activeKey.firstChild.lastChild.innerHTML || ''
                }${right}`;
              }
            } else if (
              !activeKey.lastChild.firstChild.classList.contains('hidden')
            ) {
              this.textarea.value = `${left}${
                activeKey.lastChild.firstChild.innerHTML || ''
              }${right}`;
            } else {
              this.textarea.value = `${left}${
                activeKey.lastChild.lastChild.innerHTML || ''
              }${right}`;
            }
          }
        }
        this.textarea.setSelectionRange(cursor, cursor);
      }

      if (event.code.match(/Shift/)) {
        btnKeys.forEach((e) => {
          if (
            !e.className.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
            )
          ) {
            e.firstChild.firstChild.classList.add('hidden');
            e.lastChild.firstChild.classList.add('hidden');
            e.firstChild.lastChild.classList.remove('hidden');
            e.lastChild.lastChild.classList.remove('hidden');
          }
        });
      }

      if (event.code.match(/CapsLock/)) {
        if (!this.isActiveCaps) {
          activeKey.classList.add('caps-active');
          this.isActiveCaps = true;
          btnKeys.forEach((e) => {
            if (
              !e.className.match(
                /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
              )
            ) {
              e.firstChild.firstChild.classList.add('hidden');
              e.lastChild.firstChild.classList.add('hidden');
              e.firstChild.lastChild.classList.remove('hidden');
              e.lastChild.lastChild.classList.remove('hidden');
            }
          });
        } else {
          activeKey.classList.remove('caps-active');
          this.isActiveCaps = false;
          btnKeys.forEach((e) => {
            if (
              !e.className.match(
                /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
              )
            ) {
              e.firstChild.lastChild.classList.add('hidden');
              e.lastChild.lastChild.classList.add('hidden');
              e.firstChild.firstChild.classList.remove('hidden');
              e.lastChild.firstChild.classList.remove('hidden');
            }
          });
        }
      }

      if (event.code.match(/Shift/)) this.ctrlKey = true;
      if (event.code.match(/Alt/)) this.AltKey = true;

      if (this.ctrlKey && this.AltKey) {
        btnKeys.forEach((e) => {
          if (e.firstChild.classList.contains('hidden')) {
            e.firstChild.classList.remove('hidden');
            e.lastChild.classList.add('hidden');
            localStorage.setItem('lang', 'ru');
          } else {
            e.lastChild.classList.remove('hidden');
            e.firstChild.classList.add('hidden');
            localStorage.setItem('lang', 'en');
          }
        });
      }
    }

    if (event.type === 'keyup') {
      if (activeKey) activeKey.classList.remove('active');
      if (event.code.match(/Shift/)) this.ctrlKey = false;
      if (event.code.match(/Alt/)) this.AltKey = false;

      if (event.code.match(/Shift/)) {
        btnKeys.forEach((e) => {
          if (
            !e.className.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
            )
          ) {
            e.firstChild.lastChild.classList.add('hidden');
            e.lastChild.lastChild.classList.add('hidden');
            e.firstChild.firstChild.classList.remove('hidden');
            e.lastChild.firstChild.classList.remove('hidden');
          }
        });
      }
    }
  };

  handleMouseEvent = (event) => {
    let cursor = this.textarea.selectionStart;
    this.textarea.focus();
    const left = this.textarea.value.slice(0, cursor);
    const right = this.textarea.value.slice(cursor);
    const element = event.srcElement.closest('.key');
    if (element) {
      if (
        event.type === 'mousedown'
        && !element.className.match(/Alt|Control|Caps|Shift/)
      ) {
        if (element.className.match(/Tab/)) {
          this.textarea.value = `${left}    ${right}`;
          cursor += 4;
        } else if (element.className.match(/ArrowLeft/)) {
          cursor = cursor - 1 >= 0 ? cursor - 1 : 0;
        } else if (element.className.match(/ArrowRight/)) {
          cursor += 1;
        } else if (element.className.match(/ArrowUp/)) {
          const posLeft = this.textarea.value
            .slice(0, cursor)
            .match(/(\n).*$(?!\1)/g) || [[1]];
          cursor -= posLeft[0].length;
        } else if (element.className.match(/ArrowDown/)) {
          const posLeft = this.textarea.value
            .slice(0, cursor)
            .match(/(\n).*$(?!\1)/g) || [[1]];
          cursor += posLeft[0].length;
        } else if (element.className.match(/Enter/)) {
          this.textarea.value = `${left}\n${right}`;
          cursor += 1;
        } else if (element.className.match(/Delete/)) {
          this.textarea.value = `${left}${right.slice(1)}`;
        } else if (element.className.match(/Backspace/)) {
          this.textarea.value = `${left.slice(0, -1)}${right}`;
          cursor -= 1;
        } else if (element.className.match(/Space/)) {
          this.textarea.value = `${left} ${right}`;
          cursor += 1;
        } else {
          cursor += 1;
          if (
            !element.className.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Del|Tab/,
            )
          ) {
            if (!element.firstChild.classList.contains('hidden')) {
              if (!element.firstChild.firstChild.classList.contains('hidden')) {
                this.textarea.value = `${left}${
                  element.firstChild.firstChild.innerHTML || ''
                }${right}`;
              } else {
                this.textarea.value = `${left}${
                  element.firstChild.lastChild.innerHTML || ''
                }${right}`;
              }
            } else if (
              !element.lastChild.firstChild.classList.contains('hidden')
            ) {
              this.textarea.value = `${left}${
                element.lastChild.firstChild.innerHTML || ''
              }${right}`;
            } else {
              this.textarea.value = `${left}${
                element.lastChild.lastChild.innerHTML || ''
              }${right}`;
            }
          }
        }
        this.textarea.setSelectionRange(cursor, cursor);
      }

      if (event.type === 'mousedown' && element.className.match(/Shift/)) {
        element.classList.add('active');
        btnKeys.forEach((e) => {
          if (
            !e.className.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
            )
          ) {
            e.firstChild.firstChild.classList.add('hidden');
            e.lastChild.firstChild.classList.add('hidden');
            e.firstChild.lastChild.classList.remove('hidden');
            e.lastChild.lastChild.classList.remove('hidden');
          }
        });
      }

      if (event.type === 'mouseup' && element.className.match(/Shift/)) {
        element.classList.remove('active');
        btnKeys.forEach((e) => {
          if (
            !e.className.match(
              /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
            )
          ) {
            e.firstChild.lastChild.classList.add('hidden');
            e.lastChild.lastChild.classList.add('hidden');
            e.firstChild.firstChild.classList.remove('hidden');
            e.lastChild.firstChild.classList.remove('hidden');
          }
        });
      }

      if (event.type === 'mousedown' && element.className.match(/Caps/)) {
        if (!this.isActiveCaps) {
          element.classList.add('caps-active');
          this.isActiveCaps = true;
          btnKeys.forEach((e) => {
            if (
              !e.className.match(
                /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
              )
            ) {
              e.firstChild.firstChild.classList.add('hidden');
              e.lastChild.firstChild.classList.add('hidden');
              e.firstChild.lastChild.classList.remove('hidden');
              e.lastChild.lastChild.classList.remove('hidden');
            }
          });
        } else {
          element.classList.remove('caps-active');
          this.isActiveCaps = false;
          btnKeys.forEach((e) => {
            if (
              !e.className.match(
                /Control|Alt|Shift|CapsLock|Backspace|Arrow|Enter|Meta|Tab|Del/,
              )
            ) {
              e.firstChild.lastChild.classList.add('hidden');
              e.lastChild.lastChild.classList.add('hidden');
              e.firstChild.firstChild.classList.remove('hidden');
              e.lastChild.firstChild.classList.remove('hidden');
            }
          });
        }
      }
    }
  };
}

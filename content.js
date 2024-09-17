// 创建翻译按钮
function createTranslateButton(x, y) {
  const button = document.createElement('button');
  button.textContent = '翻译';
  button.style.position = 'absolute';
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;
  button.style.zIndex = '9999';
  button.style.backgroundColor = 'white';
  button.style.border = '1px solid black';
  button.style.padding = '10px';
  button.style.cursor = 'pointer';
  button.classList.add('translate-button'); // 添加类名
  return button;
}

// 创建翻译结果弹窗
function createTranslationPopup(text, x, y) {
  const popup = document.createElement('div');
  popup.textContent = text;
  popup.style.position = 'absolute';
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.padding = '10px';
  popup.style.zIndex = '10000';
  popup.classList.add('translation-popup'); // 添加类名
  return popup;
}

// Mock 翻译函数
function mockTranslate(text) {
  return `Mock translation of: "${text}"`;
}

function translate(text) {
    return browser.storage.local.get(['apiKey', 'baseUrl', 'model']).then((data) => {
        const apiKey = data.apiKey;
        const baseUrl = data.baseUrl;
        const model = data.model;
        return fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model, 
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that translates English to Simplified Chinese.'
                    },
                    {
                        role: 'user',
                        content: text
                    }   
                ]
            })
        }).then(response => response.json())
        .then(data => {
            console.log('Translation:', data.choices[0].message.content);
            return data.choices[0].message.content;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}

function removeElements() {
    document.querySelectorAll('.translation-popup').forEach(popup => {
        popup.remove();
    });
    document.querySelectorAll('.translate-button').forEach(button => {
        button.remove();
    });
    document.removeEventListener('click', removeElements);
}


// 获取元素的绝对位置
function getElementAbsolutePosition(element) {
    const rect = element.getBoundingClientRect();
    const absolutePosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
    };
    return absolutePosition;
}

function getElementFromAnchorNode(anchorNode) {
    if (anchorNode.nodeType === Node.ELEMENT_NODE) {
        return anchorNode; // 直接返回元素
    } else {
        return anchorNode.parentNode; // 返回父节点作为元素
    }
}

// 获取选区在屏幕上的位置
function getSelectionPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const position = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
        };
        return position;
    }
    return null; // 如果没有选区，返回 null
}

function addTranslationButton() {
    removeElements();
    const position = getSelectionPosition()
    if (!position) {
        return;
    }
    console.log('position', position);
    const selection = window.getSelection().toString().trim();
    const centerX = position.left + position.width / 2;
    const centerY = position.top + position.height / 2;
    const bottomY = position.top + position.height;
    const button = createTranslateButton(centerX, centerY);
    document.body.appendChild(button);
    button.addEventListener('click', async (e) => {
        e.stopPropagation();
        button.textContent = '翻译中...';
        translatedText = await translate(selection);
        popup = createTranslationPopup(translatedText, position.left, bottomY + 10);
        popup.classList.add('translation-popup');
        document.body.appendChild(popup);
        button.remove();
        document.addEventListener('click', removeElements);
        popup.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

let shiftKeyPressedTime = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'Shift') {
        let currentTime = Date.now();
        if (currentTime - shiftKeyPressedTime < 200) {
            addTranslationButton();
        }
        shiftKeyPressedTime = currentTime;
    }
});

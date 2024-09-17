// 加载保存的配置
document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const baseUrlInput = document.getElementById('baseUrl');
    const modelInput = document.getElementById('model');
    // 保存配置
    document.getElementById('saveButton').addEventListener('click', () => {
        const apiKey = apiKeyInput.value;
        const baseUrl = baseUrlInput.value;
        const model = modelInput.value;
        const dataToStore = { apiKey, baseUrl, model };
        browser.storage.local.set(dataToStore).then(() => {
            alert('设置已保存！');
        }).catch((error) => {
            console.error('Error saving settings:', error);
        });

    });
});
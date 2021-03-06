/**
 * Quill editor 插件, 用于剪贴板图片粘贴
 *
 * @file
 * @author Yangholmes 2018-01-24
 */
// 构造
var imagePaste = function (quill, options) {
    this.quill = quill;
    this.eventRegister();
};

imagePaste.prototype = {
    constructor: imagePaste,
    // 事件注册
    eventRegister: function () {
        this.handlePaste = this.handlePaste.bind(this);
        this.quill.root.addEventListener('paste', this.handlePaste);
    },

    // paste事件处理
    handlePaste: function (evt) {
        this.insert = this.insert.bind(this);
        var clipboardData = evt.clipboardData || evt.originalEvent.clipboardData;
        if (clipboardData && clipboardData.items) {
            var items = clipboardData.items;
            this.readFiles(items, this.insert);
        }
    },

    // 从clipboardData中读取图片base64数据
    readFiles: function (items, callback) {
        [].forEach.call(items, function (item) {
            if (item.kind === 'file'
                && item.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (evt) {
                    callback && callback(evt.target.result);
                }; // data url!
                reader.readAsDataURL(blob);
            }
        });
    },

    // 将base64数据装饰成<img>标签插入quill中
    insert: function (base64) {
        var selection = this.quill.getSelection(); // null may be returned if editor does not have focus
        var index = (this.quill.getSelection() || {}).index || this.quill.getLength();
        if (selection) {
            // we must be in a browser that supports pasting (like Firefox)
            // so it has already been placed into the editor
        }
        else {
            // otherwise we wait until after the paste when this.quill.getSelection()
            // will return a valid index
            setTimeout(function () {
                this.quill.insertEmbed(index, 'image', base64, 'user');
            }.bind(this), 0);
        }
    }
};

module.exports = imagePaste;

// if (window.Quill) {
//     window.Quill.register('imagePaste', imagePaste);
// }
//
//

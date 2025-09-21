// 工具栏按钮功能实现

export interface ToolbarAction {
  key: string;
  handler: () => void | Promise<void>;
}

export interface FileInfo {
  name: string;
  type: string;
  size: number;
  url: string;
}

export class ToolbarActionHandler {
  private actions: Map<string, () => void | Promise<void>> = new Map();
  private callbacks: Map<string, Function> = new Map();

  constructor() {
    this.initializeActions();
  }

  public setCallback(key: string, callback: Function) {
    this.callbacks.set(key, callback);
  }

  private initializeActions() {
    this.actions.set('addFile', this.handleAddFile);
    this.actions.set('attachment', this.handleAttachment);
    this.actions.set('webSearch', this.handleWebSearch);
    this.actions.set('save', this.handleSave);
    this.actions.set('code', this.handleCode);
    this.actions.set('mention', this.handleMention);
    this.actions.set('quickAction', this.handleQuickAction);
    this.actions.set('more', this.handleMore);
    this.actions.set('expand', this.handleExpand);
    this.actions.set('preview', this.handlePreview);
    this.actions.set('history', this.handleHistory);
    this.actions.set('translate', this.handleTranslate);
    this.actions.set('upload', this.handleUpload);
  }

  public execute(key: string) {
    const handler = this.actions.get(key);
    if (handler) {
      handler();
    } else {
      console.warn(`Unknown toolbar action: ${key}`);
    }
  }

  private handleAddFile = async () => {
    console.log('添加文件功能');
    try {
      // 创建文件选择器
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = '.txt,.md,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif';

      input.onchange = (event) => {
        const files = (event.target as HTMLInputElement).files;
        if (files) {
          const fileInfos: FileInfo[] = Array.from(files).map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            url: URL.createObjectURL(file)
          }));

          const callback = this.callbacks.get('fileSelected');
          if (callback) callback(fileInfos);
        }
      };

      input.click();
    } catch (error) {
      console.error('文件选择失败:', error);
    }
  };

  private handleAttachment = () => {
    console.log('附件管理功能');
    const callback = this.callbacks.get('showAttachments');
    if (callback) callback();
  };

  private handleWebSearch = () => {
    console.log('网络搜索功能');
    const callback = this.callbacks.get('toggleWebSearch');
    if (callback) callback();
  };

  private handleSave = () => {
    console.log('保存草稿功能');
    const callback = this.callbacks.get('saveDraft');
    if (callback) {
      callback();
      // 显示保存成功提示
      this.showToast('草稿已保存', 'success');
    }
  };

  private handleCode = () => {
    console.log('代码块插入功能');
    const callback = this.callbacks.get('insertCodeBlock');
    if (callback) {
      callback('```\n// 在此输入代码\n\n```');
    }
  };

  private handleMention = () => {
    console.log('提及助手功能');
    const callback = this.callbacks.get('showAssistantMenu');
    if (callback) callback();
  };

  private handleQuickAction = () => {
    console.log('快速操作菜单');
    const callback = this.callbacks.get('showQuickActions');
    if (callback) callback();
  };

  private handleMore = () => {
    console.log('更多选项菜单');
    const callback = this.callbacks.get('showMoreOptions');
    if (callback) callback();
  };

  private handleExpand = () => {
    console.log('全屏编辑模式');
    const callback = this.callbacks.get('toggleExpand');
    if (callback) callback();
  };

  private handlePreview = () => {
    console.log('消息预览功能');
    const callback = this.callbacks.get('showPreview');
    if (callback) callback();
  };

  private handleHistory = () => {
    console.log('历史记录功能');
    const callback = this.callbacks.get('showHistory');
    if (callback) callback();
  };

  private handleTranslate = () => {
    console.log('翻译功能');
    const callback = this.callbacks.get('translateText');
    if (callback) callback();
  };

  private handleUpload = async () => {
    console.log('快速上传功能');
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const callback = this.callbacks.get('uploadFile');
          if (callback) {
            this.showToast('正在上传...', 'loading');
            try {
              await callback(file);
              this.showToast('上传成功', 'success');
            } catch (error) {
              this.showToast('上传失败', 'error');
            }
          }
        }
      };

      input.click();
    } catch (error) {
      console.error('上传失败:', error);
      this.showToast('上传失败', 'error');
    }
  };

  private showToast = (message: string, type: 'success' | 'error' | 'loading' = 'success') => {
    // 简单的Toast实现
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 16px;
      border-radius: 8px;
      color: white;
      font-size: 14px;
      z-index: 10000;
      transition: all 0.3s ease;
      background: ${type === 'success' ? '#52c41a' : type === 'error' ? '#ff4d4f' : '#1890ff'};
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(toast);

    // 3秒后自动移除
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  };
}

export const toolbarHandler = new ToolbarActionHandler();

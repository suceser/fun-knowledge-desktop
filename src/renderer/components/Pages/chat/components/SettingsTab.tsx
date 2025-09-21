import React, { useState } from 'react';
import { Form, Switch, Select, Slider, Typography, Divider, Collapse } from 'antd';
import {
  SettingOutlined,
  FunctionOutlined,
  CodeOutlined,
  EditOutlined,
  RobotOutlined,
  MessageOutlined,
  CaretRightOutlined
} from '@ant-design/icons';
import './SettingsTab.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

function SettingsTab() {
  const [activeKeys, setActiveKeys] = useState<string[]>(['math', 'code', 'input', 'assistant', 'message']);

  const handlePanelChange = (keys: string | string[]) => {
    setActiveKeys(Array.isArray(keys) ? keys : [keys]);
  };

  return (
    <div className="settings-tab">
      <div className="tab-header">
        <Title level={5} className="tab-title">问答设置</Title>
      </div>

      <div className="settings-content">
        <Collapse
          activeKey={activeKeys}
          onChange={handlePanelChange}
          ghost
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          className="settings-collapse"
        >
          {/* 数学公式设置 */}
          <Panel
            header={
              <div className="panel-header">
                <FunctionOutlined className="panel-icon" />
                <span>数学公式设置</span>
              </div>
            }
            key="math"
          >
            <Form layout="vertical" className="settings-form">
              <Form.Item label="数学公式引擎" className="setting-item">
                <Select defaultValue="mathjax" size="small" className="setting-select">
                  <Option value="mathjax">MathJax</Option>
                  <Option value="katex">KaTeX</Option>
                </Select>
              </Form.Item>

              <Form.Item label="启用 $...$" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  启用内联数学公式语法
                </Text>
              </Form.Item>
            </Form>
          </Panel>

          {/* 代码块设置 */}
          <Panel
            header={
              <div className="panel-header">
                <CodeOutlined className="panel-icon" />
                <span>代码块设置</span>
              </div>
            }
            key="code"
          >
            <Form layout="vertical" className="settings-form">
              <Form.Item label="代码风格" className="setting-item">
                <Select defaultValue="auto" size="small" className="setting-select">
                  <Option value="auto">auto</Option>
                  <Option value="github">GitHub</Option>
                  <Option value="monokai">Monokai</Option>
                  <Option value="solarized">Solarized</Option>
                </Select>
              </Form.Item>

              <Form.Item label="代码执行" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  允许执行代码块中的代码
                </Text>
              </Form.Item>

              <Form.Item label="代码编辑器" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  启用代码块编辑功能
                </Text>
              </Form.Item>

              <Form.Item label="代码显示行号" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  在代码块中显示行号
                </Text>
              </Form.Item>

              <Form.Item label="代码块可折叠" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  允许折叠长代码块
                </Text>
              </Form.Item>

              <Form.Item label="代码块可换行" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  代码内容自动换行
                </Text>
              </Form.Item>

              <Form.Item label="启用预览工具" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  显示代码预览和工具栏
                </Text>
              </Form.Item>
            </Form>
          </Panel>

          {/* 输入设置 */}
          <Panel
            header={
              <div className="panel-header">
                <EditOutlined className="panel-icon" />
                <span>输入设置</span>
              </div>
            }
            key="input"
          >
            <Form layout="vertical" className="settings-form">
              <Form.Item label="显示预估 Token 数" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  在输入框显示预估的Token消耗
                </Text>
              </Form.Item>

              <Form.Item label="长文本粘贴为文件" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  自动将长文本转换为文件附件
                </Text>
              </Form.Item>

              <Form.Item label="Markdown 渲染输入消息" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  实时渲染输入的Markdown格式
                </Text>
              </Form.Item>

              <Form.Item label="3个空格快速翻译" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  输入3个空格触发翻译功能
                </Text>
              </Form.Item>

              <Form.Item label="显示翻译确认对话框" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  翻译前显示确认对话框
                </Text>
              </Form.Item>

              <Form.Item label="启用 / 和 @ 触发快捷菜单" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  使用斜杠和@符号触发快捷命令
                </Text>
              </Form.Item>

              <Form.Item label="删除消息前确认" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  删除消息时显示确认提示
                </Text>
              </Form.Item>

              <Form.Item label="重新生成消息前确认" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  重新生成回答时显示确认提示
                </Text>
              </Form.Item>

              <Form.Item label="目标语言" className="setting-item">
                <Select defaultValue="en" size="small" className="setting-select">
                  <Option value="zh">中文</Option>
                  <Option value="en">英文</Option>
                  <Option value="ja">日文</Option>
                  <Option value="ko">韩文</Option>
                  <Option value="fr">法文</Option>
                </Select>
              </Form.Item>

              <Form.Item label="发送快捷键" className="setting-item">
                <Select defaultValue="enter" size="small" className="setting-select">
                  <Option value="enter">Enter</Option>
                  <Option value="ctrl-enter">Ctrl+Enter</Option>
                  <Option value="shift-enter">Shift+Enter</Option>
                </Select>
              </Form.Item>
            </Form>
          </Panel>

          {/* 助手设置 */}
          <Panel
            header={
              <div className="panel-header">
                <RobotOutlined className="panel-icon" />
                <span>助手设置</span>
              </div>
            }
            key="assistant"
          >
            <Form layout="vertical" className="settings-form">
              <Form.Item label="模型温度" className="setting-item">
                <Switch defaultChecked size="small" />
                <Slider
                  min={0}
                  max={100}
                  defaultValue={50}
                  className="temperature-slider setting-slider"
                  disabled={false}
                />
                <Text type="secondary" className="setting-description">
                  控制回答的创造性和随机性
                </Text>
              </Form.Item>

              <Form.Item label="上下文数" className="setting-item">
                <Slider
                  min={1}
                  max={20}
                  defaultValue={5}
                  className="context-slider setting-slider"
                />
                <Text type="secondary" className="setting-description">
                  设置对话上下文的消息数量
                </Text>
              </Form.Item>

              <Form.Item label="流式输出" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  逐步显示AI回答内容
                </Text>
              </Form.Item>

              <Form.Item label="最大Token数" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  限制单次回答的最大长度
                </Text>
              </Form.Item>
            </Form>
          </Panel>

          {/* 消息设置 */}
          <Panel
            header={
              <div className="panel-header">
                <MessageOutlined className="panel-icon" />
                <span>消息设置</span>
              </div>
            }
            key="message"
          >
            <Form layout="vertical" className="settings-form">
              <Form.Item label="显示提示词" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  显示AI的系统提示词
                </Text>
              </Form.Item>

              <Form.Item label="使用等线字体" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  使用等宽字体显示消息
                </Text>
              </Form.Item>

              <Form.Item label="思考内容自动折叠" className="setting-item">
                <Switch defaultChecked size="small" />
                <Text type="secondary" className="setting-description">
                  自动折叠AI的思考过程
                </Text>
              </Form.Item>

              <Form.Item label="显示消息大纲" className="setting-item">
                <Switch size="small" />
                <Text type="secondary" className="setting-description">
                  显示长消息的内容大纲
                </Text>
              </Form.Item>

              <Form.Item label="消息样式" className="setting-item">
                <Select defaultValue="simple" size="small" className="setting-select">
                  <Option value="simple">简洁</Option>
                  <Option value="detailed">详细</Option>
                  <Option value="compact">紧凑</Option>
                </Select>
              </Form.Item>

              <Form.Item label="多模型回答样式" className="setting-item">
                <Select defaultValue="tabs" size="small" className="setting-select">
                  <Option value="tabs">标签模式</Option>
                  <Option value="stack">堆叠模式</Option>
                  <Option value="carousel">轮播模式</Option>
                </Select>
              </Form.Item>

              <Form.Item label="对话导航按钮" className="setting-item">
                <Select defaultValue="vertical" size="small" className="setting-select">
                  <Option value="vertical">上下按钮</Option>
                  <Option value="horizontal">左右按钮</Option>
                  <Option value="floating">浮动按钮</Option>
                </Select>
              </Form.Item>

              <Form.Item label="消息字体大小" className="setting-item">
                <Slider
                  min={12}
                  max={24}
                  defaultValue={14}
                  className="font-size-slider setting-slider"
                />
                <div className="font-size-labels">
                  <Text type="secondary" className="font-label">A</Text>
                  <Text type="secondary" className="font-label-large">A</Text>
                </div>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
}

export default SettingsTab;

import React, { useState } from 'react';
import { Collapse, Form, Switch, Slider, Select, Typography, Tooltip } from 'antd';
import {
  SettingOutlined, MessageOutlined, FunctionOutlined,
  CodeOutlined, EditOutlined, QuestionCircleOutlined,
  DownOutlined
} from '@ant-design/icons';
import './ChatSettingsTab.css';

const { Panel } = Collapse;
const { Text } = Typography;
const { Option } = Select;

const ChatSettingsTab: React.FC = () => {
  const [temperature, setTemperature] = useState(0.7);
  const [contextCount, setContextCount] = useState(10);
  const [fontSize, setFontSize] = useState(14);

  return (
    <div className="chat-settings-tab">
      <Collapse
        defaultActiveKey={['1', '2', '3', '4', '5']}
        expandIconPosition="end"
        expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} />}
        className="settings-collapse"
        ghost
      >
        {/* 助手设置 */}
        <Panel
          header={
            <div className="panel-header">
              <SettingOutlined className="panel-icon" />
              <Text className="panel-title">助手设置</Text>
            </div>
          }
          key="1"
          className="settings-panel"
        >
          <div className="setting-item">
            <div className="setting-header">
              <Text className="setting-label">模型温度</Text>
              <Tooltip title="控制回答的随机性，值越大越随机">
                <QuestionCircleOutlined className="setting-help-icon" />
              </Tooltip>
            </div>
            <Switch defaultChecked className="setting-switch" />
          </div>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={setTemperature}
            className="setting-slider"
          />

          <div className="setting-item">
            <div className="setting-header">
              <Text className="setting-label">上下文数</Text>
              <Tooltip title="对话时包含的历史消息数量">
                <QuestionCircleOutlined className="setting-help-icon" />
              </Tooltip>
            </div>
          </div>
          <Slider
            min={0}
            max={20}
            value={contextCount}
            onChange={setContextCount}
            className="setting-slider"
          />

          <div className="setting-item">
            <Text className="setting-label">流式输出</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <div className="setting-header">
              <Text className="setting-label">最大 Token 数</Text>
              <Tooltip title="限制回答的最大长度">
                <QuestionCircleOutlined className="setting-help-icon" />
              </Tooltip>
            </div>
            <Switch className="setting-switch" />
          </div>
        </Panel>

        {/* 消息设置 */}
        <Panel
          header={
            <div className="panel-header">
              <MessageOutlined className="panel-icon" />
              <Text className="panel-title">消息设置</Text>
            </div>
          }
          key="2"
          className="settings-panel"
        >
          <div className="setting-item">
            <Text className="setting-label">显示提示词</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">使用衬线字体</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <div className="setting-header">
              <Text className="setting-label">思考内容自动折叠</Text>
              <Tooltip title="AI思考过程内容默认折叠">
                <QuestionCircleOutlined className="setting-help-icon" />
              </Tooltip>
            </div>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">显示消息大纲</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">消息样式</Text>
            <Select defaultValue="simple" className="setting-select">
              <Option value="simple">简洁</Option>
              <Option value="detailed">详细</Option>
              <Option value="card">卡片</Option>
            </Select>
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">多模型回答样式</Text>
            <Select defaultValue="tabs" className="setting-select">
              <Option value="tabs">标签模式</Option>
              <Option value="parallel">并排模式</Option>
              <Option value="stacked">堆叠模式</Option>
            </Select>
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">对话导航按钮</Text>
            <Select defaultValue="updown" className="setting-select">
              <Option value="updown">上下按钮</Option>
              <Option value="arrows">箭头</Option>
              <Option value="dots">圆点</Option>
            </Select>
          </div>

          <div className="setting-item-full">
            <Text className="setting-label">消息字体大小</Text>
            <div className="font-size-container">
              <Text className="font-size-label">A</Text>
              <Slider
                min={12}
                max={20}
                value={fontSize}
                onChange={setFontSize}
                className="setting-slider flex-1"
              />
              <Text className="font-size-label large">A</Text>
            </div>
            <Text className="font-size-value">默认</Text>
          </div>
        </Panel>

        {/* 数学公式设置 */}
        <Panel
          header={
            <div className="panel-header">
              <FunctionOutlined className="panel-icon" />
              <Text className="panel-title">数学公式设置</Text>
            </div>
          }
          key="3"
          className="settings-panel"
        >
          <div className="setting-item-select">
            <Text className="setting-label">数学公式引擎</Text>
            <Select defaultValue="mathjax" className="setting-select">
              <Option value="mathjax">MathJax</Option>
              <Option value="katex">KaTeX</Option>
            </Select>
          </div>

          <div className="setting-item">
            <div className="setting-header">
              <Text className="setting-label">启用 $...$</Text>
              <Tooltip title="使用单个$符号包裹行内公式">
                <QuestionCircleOutlined className="setting-help-icon" />
              </Tooltip>
            </div>
            <Switch defaultChecked className="setting-switch" />
          </div>
        </Panel>

        {/* 代码块设置 */}
        <Panel
          header={
            <div className="panel-header">
              <CodeOutlined className="panel-icon" />
              <Text className="panel-title">代码块设置</Text>
            </div>
          }
          key="4"
          className="settings-panel"
        >
          <div className="setting-item">
            <Text className="setting-label">显示行号</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">自动折叠长代码</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">启用代码高亮</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">代码主题</Text>
            <Select defaultValue="dark" className="setting-select">
              <Option value="dark">暗色</Option>
              <Option value="light">亮色</Option>
              <Option value="monokai">Monokai</Option>
              <Option value="github">GitHub</Option>
            </Select>
          </div>
        </Panel>

        {/* 输入设置 */}
        <Panel
          header={
            <div className="panel-header">
              <EditOutlined className="panel-icon" />
              <Text className="panel-title">输入设置</Text>
            </div>
          }
          key="5"
          className="settings-panel"
        >
          <div className="setting-item">
            <Text className="setting-label">显示预估 Token 数</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">长文本粘贴为文件</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">Markdown 渲染输入消息</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">3 个空格快速翻译</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">显示翻译确认对话框</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">启用 / 和 @ 触发快捷菜单</Text>
            <Switch className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">删除消息前确认</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item">
            <Text className="setting-label">重新生成消息前确认</Text>
            <Switch defaultChecked className="setting-switch" />
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">目标语言</Text>
            <Select defaultValue="en" className="setting-select" suffixIcon={<span>🇬🇧</span>}>
              <Option value="en">英文</Option>
              <Option value="zh">中文</Option>
              <Option value="ja">日文</Option>
              <Option value="ko">韩文</Option>
            </Select>
          </div>

          <div className="setting-item-select">
            <Text className="setting-label">发送快捷键</Text>
            <Select defaultValue="enter" className="setting-select">
              <Option value="enter">Enter</Option>
              <Option value="ctrl-enter">Ctrl + Enter</Option>
              <Option value="shift-enter">Shift + Enter</Option>
            </Select>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ChatSettingsTab;


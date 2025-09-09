import React from 'react';
import { Card, Typography, Button } from 'antd';
import { ApiOutlined, PlusOutlined, LinkOutlined, AppstoreOutlined } from '@ant-design/icons';
import './MCPSettings.css';

const { Title, Text } = Typography;

interface MCPSettingsProps {
  // 可以添加props用于状态管理
}

interface MCPServer {
  id: string;
  name: string;
  description: string;
  icon: string;
  url?: string;
}

const MCPSettings: React.FC<MCPSettingsProps> = () => {
  // 模拟的更多MCP服务器数据
  const moreMCPServers: MCPServer[] = [
    {
      id: 'bigmodel',
      name: 'BigModel MCP Market',
      description: '精选MCP，极速接入',
      icon: 'bigmodel',
      url: 'https://bigmodel.cn'
    },
    {
      id: 'modelscope',
      name: 'modelscope.cn',
      description: '魔搭社区 MCP 服务器',
      icon: 'modelscope',
      url: 'https://modelscope.cn'
    },
    {
      id: 'higress',
      name: 'mcp.higress.ai',
      description: 'Higress MCP 服务器',
      icon: 'higress',
      url: 'https://higress.ai'
    },
    {
      id: 'mcpso',
      name: 'mcp.so',
      description: 'MCP 服务器发现平台',
      icon: 'mcpso',
      url: 'https://mcp.so'
    },
    {
      id: 'smithery',
      name: 'smithery.ai',
      description: 'Smithery MCP 工具',
      icon: 'smithery',
      url: 'https://smithery.ai'
    },
    {
      id: 'glama',
      name: 'glama.ai',
      description: 'Glama MCP 服务器目录',
      icon: 'glama',
      url: 'https://glama.ai'
    },
    {
      id: 'pulsemcp',
      name: 'pulsemcp.com',
      description: 'Pulse MCP 服务器',
      icon: 'pulsemcp',
      url: 'https://pulsemcp.com'
    },
    {
      id: 'composio',
      name: 'mcp.composio.dev',
      description: 'Composio MCP 开发工具',
      icon: 'composio',
      url: 'https://composio.dev'
    },
    {
      id: 'mcpservers',
      name: 'Model Context Protocol Servers',
      description: '官方 MCP 服务器集合',
      icon: 'mcpservers',
      url: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'awesome',
      name: 'Awesome MCP Servers',
      description: '精选的 MCP 服务器列表',
      icon: 'awesome',
      url: 'https://github.com/punkpeye/awesome-mcp-servers'
    }
  ];

  const handleAddServer = () => {
    // 处理添加服务器逻辑
    console.log('添加MCP服务器');
  };

  const handleOpenExternal = (url?: string) => {
    if (url) {
      // 处理打开外部链接逻辑
      console.log('打开外部链接:', url);
    }
  };

  return (
    <div className="settings-content-section">
      {/* 页面头部 */}
      <div className="mcp-header">
        <Title level={3} className="mcp-title">
          <ApiOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
          MCP 服务器
        </Title>
        <Text className="mcp-subtitle">
          未配置服务器
        </Text>
      </div>

      {/* 空状态 */}
      <div className="mcp-empty-state">
        <div className="empty-icon">
          <ApiOutlined />
        </div>
        <Title level={4} className="empty-title">
          未配置服务器
        </Title>
        <Text className="empty-description">
          您还没有配置任何MCP服务器，点击下方按钮开始添加
        </Text>
      </div>

      {/* 添加服务器按钮 */}
      <Button 
        className="add-server-btn"
        onClick={handleAddServer}
      >
        <PlusOutlined />
        添加
      </Button>

      {/* 更多MCP部分 */}
      <div className="more-mcp-section">
        <Title level={4} className="more-mcp-title">
          <AppstoreOutlined />
          更多 MCP
        </Title>
        
        <div className="more-mcp-grid">
          {moreMCPServers.map((server) => (
            <Card 
              key={server.id}
              className="more-mcp-card"
              onClick={() => handleOpenExternal(server.url)}
            >
              <div className="more-mcp-header">
                <div className={`more-mcp-icon ${server.icon}`}>
                  {server.icon === 'bigmodel' && '🤖'}
                  {server.icon === 'modelscope' && '🔮'}
                  {server.icon === 'higress' && '🚀'}
                  {server.icon === 'mcpso' && '🌐'}
                  {server.icon === 'smithery' && '🔨'}
                  {server.icon === 'glama' && '✨'}
                  {server.icon === 'pulsemcp' && '💓'}
                  {server.icon === 'composio' && '🎵'}
                  {server.icon === 'mcpservers' && '📋'}
                  {server.icon === 'awesome' && '⭐'}
                </div>
                <Text className="more-mcp-name">
                  {server.name}
                </Text>
                <LinkOutlined 
                  className="external-link"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    handleOpenExternal(server.url);
                  }}
                />
              </div>
              <Text className="more-mcp-description">
                {server.description}
              </Text>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MCPSettings;
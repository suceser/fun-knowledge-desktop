import React from 'react';
import {
  Card,
  Select,
  Typography,
  Input,
  Button,
  Space,
  Upload,
  List,
  Progress,
  Tag,
  message,
} from 'antd';
import {
  FileTextOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  CloudOutlined,
  SettingOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { usePartialUpdate } from '../../../hooks/useSettingsStorage';
import { DEFAULT_APP_CONFIG, DocumentItem } from '../../../../main/types/storage';
import './DocumentSettings.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Dragger } = Upload;

function DocumentSettings(): React.ReactElement {
  // 使用持久化存储
  const [settings, updateSettings, loading] = usePartialUpdate(
    'document',
    DEFAULT_APP_CONFIG.document
  );

  const handleOcrProviderChange = async (value: string) => {
    await updateSettings({ ocrProvider: value });
    message.success('OCR服务提供商已更新');
  };

  const handleApiUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await updateSettings({ apiUrl: e.target.value });
  };

  if (loading) {
    return <div className="document-settings">加载中...</div>;
  }

  // 确保 documents 是数组
  const documents = settings.documents || [];

  const handleUpload = async (info: any) => {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
      // 添加到文档列表
      const newDoc: DocumentItem = {
        id: Date.now().toString(),
        name: info.file.name,
        size: `${(info.file.size / 1024 / 1024).toFixed(1)}MB`,
        status: 'processing',
        progress: 0,
        type: info.file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      };
      await updateSettings({
        documents: [newDoc, ...documents],
      });
    } else if (status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    await updateSettings({
      documents: documents.filter((doc) => doc.id !== id),
    });
    message.success('文档已删除');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'processing':
        return <LoadingOutlined style={{ color: '#38b2ac' }} />;
      case 'error':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'processing':
        return '处理中';
      case 'error':
        return '处理失败';
      default:
        return '未知';
    }
  };

  return (
    <div className="settings-content-section document-settings">
      <div className="settings-header">
        <Title level={3}>
          <FileTextOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
          文档处理
        </Title>
      </div>

      <div className="settings-sections">
        {/* OCR服务配置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <CloudOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              OCR服务
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    OCR服务提供商
                  </Text>
                </div>
                <Select
                  value={settings.ocrProvider}
                  onChange={handleOcrProviderChange}
                  style={{ minWidth: '120px' }}
                >
                  <Option value="系统OCR">系统OCR</Option>
                  <Option value="MinerU">MinerU</Option>
                </Select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    支持的语言
                  </Text>
                </div>
                <Tag color="#38b2ac">MacOS无需配置</Tag>
              </div>
            </div>
          </Space>
        </Card>

        {/* 文档处理配置 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <SettingOutlined
                style={{ marginRight: '8px', color: '#38b2ac' }}
              />
              文档处理
            </span>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    文档处理服务商
                  </Text>
                </div>
                <Select value="MinerU" style={{ minWidth: '120px' }}>
                  <Option value="MinerU">MinerU</Option>
                </Select>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div
                  className="setting-info"
                  style={{ flexDirection: 'column', alignItems: 'flex-start' }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      marginBottom: '4px',
                    }}
                  >
                    API密钥
                  </Text>
                  <Text
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                    }}
                  >
                    MinerU现在提供每日500次的免费额度，您无需提供API密钥。
                  </Text>
                </div>
                <Button
                  type="link"
                  size="small"
                  style={{ color: '#38b2ac', padding: 0 }}
                  onClick={() => window.open('https://mineru.net', '_blank')}
                >
                  点击这里获取密钥
                </Button>
              </div>
            </div>

            <div className="setting-item">
              <div className="setting-content">
                <div className="setting-info">
                  <Text style={{ color: '#ffffff', fontSize: '14px' }}>
                    API地址
                  </Text>
                </div>
                <Input
                  value={settings.apiUrl}
                  onChange={handleApiUrlChange}
                  placeholder="https://mineru.net"
                  style={{ width: '200px' }}
                />
              </div>
            </div>
          </Space>
        </Card>

        {/* 图片上传区域 */}
        <Card
          className="settings-card"
          title={
            <span style={{ color: '#ffffff' }}>
              <InboxOutlined style={{ marginRight: '8px', color: '#38b2ac' }} />
              图片
            </span>
          }
        >
          <div className="upload-area">
            <Dragger
              name="file"
              multiple
              onChange={handleUpload}
              showUploadList={false}
              accept=".jpg,.jpeg,.png,.pdf,.docx,.doc,.txt,.md"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个或批量上传。支持 PDF、Word、图片、文本等格式
              </p>
            </Dragger>
          </div>

          {/* 文档列表 */}
          {documents.length > 0 && (
            <div className="document-list">
              <List
                itemLayout="horizontal"
                dataSource={documents}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Button
                        key="view"
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        style={{ color: '#38b2ac' }}
                      />,
                      <Button
                        key="download"
                        type="text"
                        icon={<DownloadOutlined />}
                        size="small"
                        style={{ color: '#38b2ac' }}
                      />,
                      <Button
                        key="delete"
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={() => handleDeleteDocument(item.id)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={getStatusIcon(item.status)}
                      title={item.name}
                      description={
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '4px',
                            }}
                          >
                            <Tag>{item.type}</Tag>
                            <Text
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              {item.size}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '12px',
                              }}
                            >
                              {getStatusText(item.status)}
                            </Text>
                          </div>
                          {item.status === 'processing' && (
                            <Progress
                              percent={item.progress}
                              size="small"
                              showInfo={false}
                            />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DocumentSettings;

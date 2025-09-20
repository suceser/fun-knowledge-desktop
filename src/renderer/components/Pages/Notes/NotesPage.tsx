import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  List,
  Typography,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  message,
  Empty,
  Tooltip,
  Dropdown,
  MenuProps,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  TagOutlined,
  FolderOutlined,
  MoreOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './NotesPage.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Tiptap编辑器组件
function TiptapEditor({
  value = '<p>在这里记录你的想法...</p>',
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      onChange?.(html);
    },
  });

  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}

TiptapEditor.defaultProps = {
  value: '<p>在这里记录你的想法...</p>',
  onChange: undefined,
};

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories] = useState<Category[]>([
    { id: '1', name: '工作', color: '#38b2ac', count: 0 },
    { id: '2', name: '学习', color: '#4299e1', count: 0 },
    { id: '3', name: '生活', color: '#48bb78', count: 0 },
    { id: '4', name: '想法', color: '#ed8936', count: 0 },
  ]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: '项目会议记录',
        content:
          '今天的项目会议讨论了以下几个重点：\n1. 产品功能优化\n2. 用户体验改进\n3. 技术架构升级',
        category: '工作',
        tags: ['会议', '项目'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        isFavorite: true,
      },
      {
        id: '2',
        title: 'React学习笔记',
        content:
          'React Hooks的使用要点：\n- useState用于状态管理\n- useEffect用于副作用处理\n- useCallback用于性能优化',
        category: '学习',
        tags: ['React', '前端', 'JavaScript'],
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14'),
        isFavorite: false,
      },
      {
        id: '3',
        title: '读书心得',
        content:
          '《深度工作》这本书让我重新思考了工作效率的问题。深度工作能力在信息时代变得越来越稀缺，也越来越有价值。',
        category: '学习',
        tags: ['读书', '效率'],
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13'),
        isFavorite: true,
      },
    ];
    setNotes(mockNotes);
  }, []);

  // 过滤笔记
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 处理新建/编辑笔记
  const handleSaveNote = (values: any) => {
    const noteData = {
      ...values,
      tags: values.tags || [],
      updatedAt: new Date(),
      isFavorite: editingNote?.isFavorite || false,
    };

    if (editingNote) {
      // 编辑现有笔记
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? { ...note, ...noteData } : note,
        ),
      );
      message.success('笔记更新成功');
    } else {
      // 新建笔记
      const newNote: Note = {
        id: Date.now().toString(),
        createdAt: new Date(),
        ...noteData,
      };
      setNotes((prev) => [newNote, ...prev]);
      message.success('笔记创建成功');
    }

    setIsModalVisible(false);
    setEditingNote(null);
    form.resetFields();
  };

  // 删除笔记
  const handleDeleteNote = (noteId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条笔记吗？此操作不可恢复。',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        message.success('笔记删除成功');
      },
    });
  };

  // 切换收藏状态
  const toggleFavorite = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note,
      ),
    );
  };

  // 打开编辑模态框
  const openEditModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      form.setFieldsValue({
        title: note.title,
        content: note.content,
        category: note.category,
        tags: note.tags,
      });
    } else {
      setEditingNote(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 笔记操作菜单
  const getActionMenu = (note: Note): MenuProps => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: '编辑',
        onClick: () => openEditModal(note),
      },
      {
        key: 'favorite',
        icon: note.isFavorite ? <StarFilled /> : <StarOutlined />,
        label: note.isFavorite ? '取消收藏' : '收藏',
        onClick: () => toggleFavorite(note.id),
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: '删除',
        danger: true,
        onClick: () => handleDeleteNote(note.id),
      },
    ],
  });

  return (
    <div className="notes-page">
      {/* 页面头部 */}
      <div className="notes-header">
        <div className="header-left">
          <Title level={2} className="page-title">
            <EditOutlined className="title-icon" />
            我的笔记
          </Title>
          <Text className="page-description">
            记录想法，整理知识，让思维更有条理
          </Text>
        </div>
        <div className="header-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openEditModal()}
            className="create-button"
          >
            新建笔记
          </Button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="notes-filters">
        <div className="search-section">
          <Input
            placeholder="搜索笔记标题、内容或标签..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
            allowClear
          />
        </div>
        <div className="category-section">
          <Space wrap>
            <Button
              type={selectedCategory === 'all' ? 'primary' : 'default'}
              onClick={() => setSelectedCategory('all')}
              className="category-button"
            >
              全部 ({notes.length})
            </Button>
            {categories.map((category) => {
              const count = notes.filter(
                (note) => note.category === category.name,
              ).length;
              return (
                <Button
                  key={category.id}
                  type={
                    selectedCategory === category.name ? 'primary' : 'default'
                  }
                  onClick={() => setSelectedCategory(category.name)}
                  className="category-button"
                  style={{
                    borderColor:
                      selectedCategory === category.name
                        ? category.color
                        : undefined,
                    backgroundColor:
                      selectedCategory === category.name
                        ? category.color
                        : undefined,
                  }}
                >
                  <FolderOutlined /> {category.name} ({count})
                </Button>
              );
            })}
          </Space>
        </div>
      </div>

      {/* 笔记列表 */}
      <div className="notes-content">
        {filteredNotes.length === 0 ? (
          <Empty
            description="暂无笔记"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className="empty-state"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openEditModal()}
            >
              创建第一条笔记
            </Button>
          </Empty>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 1,
              md: 2,
              lg: 2,
              xl: 3,
              xxl: 3,
            }}
            dataSource={filteredNotes}
            renderItem={(note) => (
              <List.Item>
                <Card
                  className="note-card"
                  actions={[
                    <Tooltip title="编辑" key="edit">
                      <EditOutlined onClick={() => openEditModal(note)} />
                    </Tooltip>,
                    <Tooltip
                      title={note.isFavorite ? '取消收藏' : '收藏'}
                      key="favorite"
                    >
                      {note.isFavorite ? (
                        <StarFilled
                          className="favorite-icon active"
                          onClick={() => toggleFavorite(note.id)}
                        />
                      ) : (
                        <StarOutlined
                          className="favorite-icon"
                          onClick={() => toggleFavorite(note.id)}
                        />
                      )}
                    </Tooltip>,
                    <Dropdown
                      menu={getActionMenu(note)}
                      trigger={['click']}
                      key="more"
                    >
                      <MoreOutlined />
                    </Dropdown>,
                  ]}
                >
                  <div className="note-header">
                    <Title
                      level={4}
                      className="note-title"
                      ellipsis={{ rows: 1 }}
                    >
                      {note.title}
                    </Title>
                    <Tag
                      color={
                        categories.find((c) => c.name === note.category)?.color
                      }
                    >
                      {note.category}
                    </Tag>
                  </div>

                  <Paragraph className="note-content" ellipsis={{ rows: 3 }}>
                    {note.content}
                  </Paragraph>

                  <div className="note-footer">
                    <div className="note-tags">
                      {note.tags.map((tag) => (
                        <Tag
                          key={tag}
                          icon={<TagOutlined />}
                          className="note-tag"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                    <Text className="note-date">
                      {note.updatedAt.toLocaleDateString()}
                    </Text>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>

      {/* 新建/编辑笔记模态框 */}
      <Modal
        title={editingNote ? '编辑笔记' : '新建笔记'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingNote(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        className="note-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveNote}
          className="note-form"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入笔记标题' }]}
          >
            <Input placeholder="输入笔记标题..." />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="选择分类">
              {categories.map((category) => (
                <Option key={category.id} value={category.name}>
                  <FolderOutlined style={{ color: category.color }} />{' '}
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="标签">
            <Select
              mode="tags"
              placeholder="添加标签（按回车确认）"
              tokenSeparators={[',']}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入笔记内容' }]}
          >
            <Form.Item name="content" noStyle>
              <TiptapEditor />
            </Form.Item>
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingNote(null);
                  form.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingNote ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default NotesPage;

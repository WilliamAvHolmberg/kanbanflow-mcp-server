# KanbanFlow MCP Server

A Model Context Protocol (MCP) server for KanbanFlow - manage your boards, tasks, and workflows directly from Cursor/Claude.

## 🚀 Quick Start

### 1. Get Your KanbanFlow API Token
- Go to [kanbanflow.com/api](https://kanbanflow.com/api)
- Create your API token

### 2. Clone & Build
```bash
git clone <this-repo>
cd kanbanflow-mcp-server
npm install
npm run build
```

### 3. Add to Cursor
Add this to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "kanban-flow": {
      "command": "node",
      "args": ["/full/path/to/kanbanflow-mcp-server/build/index.js"],
      "env": {
        "KANBAN_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**Replace:**
- `/full/path/to/kanbanflow-mcp-server/` with your actual path
- `your_api_token_here` with your KanbanFlow API token

### 4. Restart Cursor
That's it! 🎉

## 🛠️ Available Tools

### Board Management
- **`get-board`** - Get your board structure and column IDs
- **`get-all-tasks`** - See all tasks across all columns

### Task Operations  
- **`create-task`** - Create new tasks
- **`get-tasks`** - Get tasks from a specific column
- **`get-task-details`** - Get detailed task information
- **`update-task`** - Update task properties (name, column, color, etc.)

### Subtasks
- **`add-subtask`** - Add a subtask to any task
- **`update-subtask-by-position`** - Update subtasks by position
- **`add-subtasks`** - Add multiple subtasks at once
- **`create-task-with-subtasks`** - Create task + subtasks in one go

### Labels & Organization
- **`add-label`** - Add labels to tasks
- **`update-label`** - Update existing labels
- **`set-task-due-date`** - Set due dates
- **`update-custom-field`** - Update custom field values

### Comments
- **`add-comment`** - Add comments to tasks
- **`update-comment`** - Update existing comments

## 📝 Usage Examples

Ask Claude things like:
- "Show me my board structure"
- "Create a task called 'Fix bug' in the To-Do column"
- "Add subtasks to task T123: Write tests, Review code, Deploy"
- "Move task T456 to Done column"
- "What tasks are in my In Progress column?"

## 🔧 Development

```bash
# Build
npm run build

# Test (requires KANBAN_API_TOKEN env var)
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch
3. Make your changes
4. Test with your KanbanFlow board
5. Submit a pull request

---

**Need help?** Open an issue!
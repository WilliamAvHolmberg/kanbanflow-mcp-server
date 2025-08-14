# KanbanFlow MCP Server

A Model Context Protocol (MCP) server for KanbanFlow - manage your boards, tasks, and workflows directly from Cursor/Claude.

## 🚀 Quick Start (Recommended)

### Option 1: One-Command Setup ✨
```bash
# Install globally
npm install -g kanbanflow-mcp-server

# Auto-setup in any project
cd your-project
kanbanflow-mcp-server --setup
```

Enter your KanbanFlow API token when prompted, restart Cursor, and you're done! 🎉

### Option 2: Developer Setup 🛠️
```bash
# Clone and build
git clone <this-repo>
cd kanbanflow-mcp-server
npm install && npm run build

# Auto-setup (works here too!)
kanbanflow-mcp-server --setup
```

Or manually add to your `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "kanban-flow": {
      "command": "node",
      "args": ["/path/to/kanbanflow-mcp-server/build/index.js"],
      "env": {
        "KANBAN_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

## 🔑 Get Your API Token
Get your KanbanFlow API token from [kanbanflow.com/api](https://kanbanflow.com/api)

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
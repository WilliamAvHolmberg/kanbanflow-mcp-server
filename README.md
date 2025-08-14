# KanbanFlow MCP Server

A Model Context Protocol (MCP) server for KanbanFlow - manage your boards, tasks, and workflows directly from Cursor/Claude.

## 🚀 Quick Start (One Command!)

### 🎯 Recommended: Auto-Setup
```bash
# Install globally
npm install -g kanbanflow-mcp-server

# Auto-magic setup in ANY project
cd your-project-folder
kanbanflow-mcp-server --setup
```

**That's it!** ✨ The setup wizard will:
- 🔍 **Detect** your installation automatically
- 🛡️ **Preserve** any existing MCP servers you have
- 💾 **Create backups** of your configuration
- ⚙️ **Generate** the perfect config with full paths
- 🎯 **Add** KanbanFlow to your Cursor setup

### 🛠️ Alternative: Developer Setup
```bash
# Clone and build from source
git clone https://github.com/williamavholmberg/kanbanflow-mcp-server
cd kanbanflow-mcp-server
npm install && npm run build

# Same magic setup wizard works here too!
kanbanflow-mcp-server --setup
```

## 🔑 Get Your API Token
1. Go to [kanbanflow.com/api](https://kanbanflow.com/api)
2. Create your API token
3. Enter it when prompted by the setup wizard

## 🛡️ Safe & Smart Configuration

The setup wizard is **bulletproof**:

- ✅ **Never overwrites** your existing MCP servers
- ✅ **Creates automatic backups** before any changes
- ✅ **Merges intelligently** with your current setup
- ✅ **Uses reliable paths** (no binary issues)
- ✅ **Works everywhere** (macOS, Windows, Linux)

### Example Scenarios:

**New project?**
```bash
📝 Creating new MCP configuration file...
✅ Setup complete!
```

**Already have MCP servers?**
```bash
📋 Found existing MCP configuration with 2 server(s)
➕ Adding kanban-flow to existing configuration...
💾 Created backup: mcp.json.backup.1692123456789
✅ Setup complete!
💡 Your existing MCP servers are preserved!
```

**Updating KanbanFlow config?**
```bash
📋 Found existing MCP configuration with 3 server(s)
🔄 Updating existing kanban-flow configuration...
💾 Created backup: mcp.json.backup.1692123456789
✅ Setup complete!
```

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
- *"Show me my board structure"*
- *"Create a task called 'Fix bug' in the To-Do column"*
- *"Add subtasks to task T123: Write tests, Review code, Deploy"*
- *"Move task T456 to Done column"*
- *"What tasks are in my In Progress column?"*
- *"Create a task with 3 subtasks for implementing user authentication"*

## 🔧 Manual Configuration (Advanced)

If you prefer manual setup, the wizard generates this format:

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

## 🚀 Development

```bash
# Build
npm run build

# Help
kanbanflow-mcp-server --help

# Test (requires KANBAN_API_TOKEN env var)
npm run dev
```

## 🎯 Why This MCP Server Rocks

- 🪄 **One-command setup** - No manual config editing
- 🛡️ **Bulletproof safety** - Never breaks your existing setup
- 🎯 **Smart detection** - Works with any installation method
- 🔄 **Re-runnable** - Update your config anytime safely
- 📱 **Cross-platform** - macOS, Windows, Linux
- 🚀 **Industry-leading UX** - The way MCP setup should work

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

> 💡 **Pro tip:** Run `kanbanflow-mcp-server --setup` anytime to update your configuration safely!
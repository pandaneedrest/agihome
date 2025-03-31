// DOM elements
const promptGrid = document.querySelector('.prompt-grid');
const cardTemplate = document.getElementById('card-template');
const emptyState = document.querySelector('.empty-state');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.querySelector('.theme-toggle');
const modal = document.getElementById('promptModal');
const previewModal = document.getElementById('previewModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closePreviewBtn = document.getElementById('closePreviewBtn');
const editBtn = document.getElementById('editBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const copyMarkdownBtn = document.getElementById('copyMarkdownBtn');
const previewBtn = document.getElementById('previewBtn');
const promptTextarea = document.getElementById('promptTextarea');
const formatTextarea = document.getElementById('formatTextarea');
const exampleTextarea = document.getElementById('exampleTextarea');
const previewContent = document.getElementById('previewContent');
const copyButtons = document.querySelectorAll('.btn-copy-section');

// State
let currentPrompt = null;
let isEditing = false;

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy: ', err);
        return false;
    }
}

// Show tooltip
function showTooltip(element, message) {
    // Remove any existing tooltips
    const existingTooltip = document.querySelector('.tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = message;
    
    // Position the tooltip
    const rect = element.getBoundingClientRect();
    document.body.appendChild(tooltip);
    
    const tooltipHeight = tooltip.offsetHeight;
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltipHeight - 8 + 'px';
    
    // Fade in
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 300);
    }, 2000);
}

// Load and display prompt data
function openPromptDetails(promptData) {
    currentPrompt = promptData;
    
    // Set modal title
    document.querySelector('.prompt-title').textContent = promptData.title;
    
    // Fill textareas with content
    promptTextarea.value = promptData.prompt || '';
    formatTextarea.value = promptData.format || '';
    exampleTextarea.value = promptData.example || '';
    
    // Reset edit mode
    setEditMode(false);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
    
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
    
    // Adjust textarea heights
    adjustTextareaHeights();
}

// Toggle edit mode
function setEditMode(editing) {
    isEditing = editing;
    
    // Toggle readonly attribute
    promptTextarea.readOnly = !editing;
    formatTextarea.readOnly = !editing;
    exampleTextarea.readOnly = !editing;
    
    // Toggle edit button active class
    if (editing) {
        editBtn.classList.add('active');
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            保存
        `;
  } else {
        editBtn.classList.remove('active');
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            编辑
        `;
    }
    
    // Adjust textarea appearance
    document.querySelectorAll('.content-textarea').forEach(textarea => {
        if (editing) {
            textarea.classList.add('editing');
        } else {
            textarea.classList.remove('editing');
        }
    });
}

// Auto-resize textareas based on content
function adjustTextareaHeights() {
    const textareas = document.querySelectorAll('.content-textarea');
    textareas.forEach(textarea => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    });
}

// Create formatted markdown
function generateMarkdown() {
    const title = currentPrompt.title;
    const prompt = promptTextarea.value.trim();
    const format = formatTextarea.value.trim();
    const example = exampleTextarea.value.trim();
    
    let markdown = `# ${title}\n\n`;
    
    if (prompt) {
        markdown += `## 提示词\n\n\`\`\`\n${prompt}\n\`\`\`\n\n`;
    }
    
    if (format) {
        markdown += `## 输出格式\n\n\`\`\`\n${format}\n\`\`\`\n\n`;
    }
    
    if (example) {
        markdown += `## 样例\n\n\`\`\`\n${example}\n\`\`\`\n\n`;
    }
    
    return markdown;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const root = document.documentElement;
    let isDarkMode = true; // Default dark mode
    
    // Check if theme preference was saved previously
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
        applyTheme(isDarkMode);
    }
    
    // Apply theme function
    function applyTheme(isDark) {
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
            // Dark theme CSS variables
            root.style.setProperty('--primary-color', '#1a1a1a');
            root.style.setProperty('--secondary-color', '#2d2d2d');
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--card-background', '#1e1e1e');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--text-secondary', '#a0a0a0');
            root.style.setProperty('--border-color', '#333333');
            root.style.setProperty('--hover-bg', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--textarea-edit-bg', '#252526');
        } else {
            root.setAttribute('data-theme', 'light');
            // Light theme CSS variables
            root.style.setProperty('--primary-color', '#ffffff');
            root.style.setProperty('--secondary-color', '#f5f5f5');
            root.style.setProperty('--background-color', '#f9fafb');
            root.style.setProperty('--card-background', '#f5f5f5');
            root.style.setProperty('--text-color', '#1a1a1a');
            root.style.setProperty('--text-secondary', '#666666');
            root.style.setProperty('--border-color', '#e5e7eb');
            root.style.setProperty('--hover-bg', 'rgba(0, 0, 0, 0.05)');
            root.style.setProperty('--textarea-edit-bg', '#f0f0f0');
        }
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyTheme(isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    // Sample prompts data
    const prompts = [
        {
            id: 1,
            category: "代码改写",
            title: "代码改写",
            description: "对代码进行修改，来实现细节、注释、调优等。",
            prompt: "请帮我优化以下代码，添加适当的注释，并提高其性能和可读性：\n\n[在此处粘贴您的代码]",
            format: "优化后的代码应包含：\n1. 清晰的注释说明\n2. 优化后的代码\n3. 性能改进说明",
            example: "原始代码：\nfunction add(a,b){return a+b}\n\n优化后：\n/**\n * 将两个数字相加\n * @param {number} a - 第一个数字\n * @param {number} b - 第二个数字\n * @returns {number} 两数之和\n */\nfunction add(a: number, b: number): number {\n    return a + b;\n}"
        },
        {
            id: 2,
            category: "代码解释",
            title: "代码解释",
            description: "对代码进行解释，来帮助理解代码内容。",
            prompt: "请详细解释以下代码的功能和工作原理：\n\n[在此处粘贴您的代码]"
        },
        {
            id: 3,
            category: "代码生成",
            title: "代码生成",
            description: "让模型生成一段完成特定功能的代码。",
            prompt: "请生成一段代码来实现以下功能：\n\n[描述您需要实现的功能]"
        },
        {
            id: 4,
            category: "数据分析",
            title: "JSON转换",
            description: "将内容转化为JSON，来方便后续序列处理。",
            prompt: "请将以下内容转换为JSON格式：\n\n[在此处输入需要转换的内容]"
        },
        {
            id: 5,
            category: "生活",
            title: "场景模拟",
            description: "提供一个场景，让模型模拟该场景下的任务对话。",
            prompt: "请模拟以下场景并进行对话：\n\n[描述场景和角色设定]"
        },
        {
            id: 6,
            category: "这也行",
            title: "文章创作",
            description: "让模型根据提示词创作散文。",
            prompt: "请根据以下主题创作一篇散文：\n\n[输入写作主题和要求]"
        },
        {
            id: 7,
            category: "研究",
            title: "论文解读",
            description: "解读和分析学术论文的内容和方法。",
            prompt: "请帮我解读以下论文的主要内容、方法和结论：\n\n[在此处粘贴论文内容]"
        },
        {
            id: 8,
            category: "数据分析",
            title: "数据可视化",
            description: "将数据转化为直观的可视化表达。",
            prompt: "请帮我设计一个数据可视化方案：\n\n[描述您的数据和需求]"
        },
        {
            id: 9,
            category: "教育",
            title: "知识讲解",
            description: "以通俗易懂的方式解释复杂概念。",
            prompt: "请用简单的语言解释以下概念：\n\n[输入需要解释的概念]"
        },
        {
            id: 10,
            category: "生产力",
            title: "工作流程优化",
            description: "优化和改进工作流程的建议。",
            prompt: "请帮我优化以下工作流程：\n\n[描述当前的工作流程]"
        }
    ];
    
    // Create prompt cards
    function createPromptCard(prompt) {
        const card = document.createElement('div');
        card.className = 'prompt-card';
        card.innerHTML = `
            <h3>${prompt.title}</h3>
            <p>${prompt.description}</p>
        `;
        
        card.addEventListener('click', () => openPromptDetails(prompt));
        
        return card;
    }
    
    // Initialize the grid
    function initializeGrid(prompts) {
        promptGrid.innerHTML = '';
        prompts.forEach(prompt => {
            const card = createPromptCard(prompt);
            promptGrid.appendChild(card);
        });
    }
    
    // Initialize with all prompts
    initializeGrid(prompts);
    
    // Filter prompts
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.textContent;
            const filteredPrompts = category === '精选' 
                ? prompts 
                : prompts.filter(p => p.category === category);
            
            initializeGrid(filteredPrompts);
        });
    });
    
    // Event listeners
    // Close modals
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('visible');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }, 300);
    });
    
    closePreviewBtn.addEventListener('click', () => {
        previewModal.style.display = 'none';
    });
    
    // Toggle edit mode
    editBtn.addEventListener('click', () => {
        if (isEditing) {
            // Save changes
            if (currentPrompt) {
                currentPrompt.prompt = promptTextarea.value;
                currentPrompt.format = formatTextarea.value;
                currentPrompt.example = exampleTextarea.value;
                showTooltip(editBtn, '已保存');
                // Here you would typically save to a database or localStorage
            }
        } else {
            showTooltip(editBtn, '现在可以编辑');
        }
        setEditMode(!isEditing);
    });
    
    // Copy all content
    copyAllBtn.addEventListener('click', async () => {
        const allContent = `${promptTextarea.value}\n\n${formatTextarea.value ? '输出格式：\n' + formatTextarea.value + '\n\n' : ''}${exampleTextarea.value ? '样例：\n' + exampleTextarea.value : ''}`;
        const success = await copyToClipboard(allContent);
        if (success) {
            showTooltip(copyAllBtn, '已复制到剪贴板');
        } else {
            showTooltip(copyAllBtn, '复制失败');
        }
    });
    
    // Copy as markdown
    copyMarkdownBtn.addEventListener('click', async () => {
        const markdown = generateMarkdown();
        const success = await copyToClipboard(markdown);
        if (success) {
            showTooltip(copyMarkdownBtn, '已复制为 Markdown');
        } else {
            showTooltip(copyMarkdownBtn, '复制失败');
        }
    });
    
    // Show preview
    previewBtn.addEventListener('click', () => {
        const promptContent = promptTextarea.value.trim();
        const formatContent = formatTextarea.value.trim();
        const exampleContent = exampleTextarea.value.trim();
        
        // 创建一个单一的Markdown格式内容
        let combinedContent = '';
        
        // 添加提示词内容（不带标题）
        if (promptContent) {
            combinedContent += `${promptContent}\n\n`;
        }
        
        // 添加输出格式内容（带标题）
        if (formatContent) {
            combinedContent += `## 输出格式\n\n${formatContent}\n\n`;
        }
        
        // 添加样例内容（带标题）
        if (exampleContent) {
            combinedContent += `## 样例\n\n${exampleContent}`;
        }
        
        // 显示为单一的文本块
        previewContent.innerHTML = `<pre>${escapeHtml(combinedContent)}</pre>`;
        previewModal.style.display = 'flex';
    });
    
    // Individual section copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.stopPropagation(); // 防止冒泡到卡片的点击事件
            
            const section = button.dataset.section;
            let content = '';
            
            switch(section) {
                case 'prompt':
                    content = promptTextarea.value;
                    break;
                case 'format':
                    content = formatTextarea.value;
                    break;
                case 'example':
                    content = exampleTextarea.value;
                    break;
            }
            
            const success = await copyToClipboard(content);
            if (success) {
                showTooltip(button, '已复制');
    } else {
                showTooltip(button, '复制失败');
            }
        });
    });
    
    // Auto-resize textareas when input changes
    document.querySelectorAll('.content-textarea').forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalBtn.click();
        }
        if (e.target === previewModal) {
            closePreviewBtn.click();
        }
    });
    
    // Escape key to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (previewModal.style.display === 'flex') {
                closePreviewBtn.click();
            } else if (modal.style.display === 'flex') {
                closeModalBtn.click();
            }
        }
    });

    // 优化滚轮事件处理
    modal.addEventListener('wheel', function(e) {
        // 检查目标是否为文本区域或其内部元素
        const textarea = e.target.closest('.content-textarea');
        
        // 如果是文本区域，让其自行处理滚动
        if (textarea) {
            // 不干预文本区域的原生滚动
            return;
        } else {
            // 如果不是文本区域，防止滚动影响背景
            e.preventDefault();
        }
    }, { passive: false });

    // 预览模态框滚动优化
    previewModal.addEventListener('wheel', function(e) {
        const previewBody = e.target.closest('.preview-body');
        
        // 如果在预览内容区域内，让其自行处理滚动
        if (previewBody) {
            // 允许预览区域内部正常滚动
            return;
        }
        
        // 如果不是在预览内容区域，防止滚动影响背景
        e.preventDefault();
    }, { passive: false });

    // 添加文本框滚动优化函数
    setupTextareaScrolling();
});

// Add CSS class for tooltip
const style = document.createElement('style');
style.innerHTML = `
.tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 2000;
    pointer-events: none;
    opacity: 0;
    transform: translateY(5px);
    transition: opacity 0.3s, transform 0.3s;
}

.tooltip.show {
    opacity: 1;
    transform: translateY(0);
}
`;
document.head.appendChild(style);

// Set up details interactions
function setupDetailsInteractions() {
    const promptDetails = document.querySelector('.prompt-details');
    if (!promptDetails) return;

    const editButton = promptDetails.querySelector('.btn-edit');
    const previewBtn = promptDetails.querySelector('.preview-btn');
    const copyAllBtn = promptDetails.querySelector('.copy-all');
    const copyMarkdownBtn = promptDetails.querySelector('.copy-markdown');
    const textareas = promptDetails.querySelectorAll('.content-textarea');
    
    // Edit button toggle
    if (editButton) {
        editButton.addEventListener('click', function() {
            const isActive = this.classList.toggle('active');
            this.innerHTML = isActive ? 
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg> 保存' :
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> 编辑';
            
            textareas.forEach(textarea => {
                textarea.readOnly = !isActive;
                if (isActive) {
                    textarea.focus();
                }
            });
            
            showTooltip(this, isActive ? '现在可以编辑' : '已保存');
        });
    }
    
    // Preview button functionality
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const promptValue = promptDetails.querySelector('.prompt-textarea')?.value.trim() || '';
            const formatValue = promptDetails.querySelector('.format-textarea')?.value.trim() || '';
            const exampleValue = promptDetails.querySelector('.example-textarea')?.value.trim() || '';
            
            let preview = '';
            
            // Add the prompt section with enhanced styling
            if (promptValue) {
                preview += '<h2 class="section-title">提示词</h2>';
                preview += `<pre>${escapeHtml(promptValue)}</pre>`;
            }
            
            // Add the format section if it has content
            if (formatValue) {
                preview += '<h2 class="section-title">输出格式</h2>';
                preview += `<pre>${escapeHtml(formatValue)}</pre>`;
            }
            
            // Add the example section if it has content
            if (exampleValue) {
                preview += '<h2 class="section-title">样例</h2>';
                preview += `<pre>${escapeHtml(exampleValue)}</pre>`;
            }
            
            document.getElementById('previewContent').innerHTML = preview;
            document.querySelector('.preview-modal').style.display = 'flex';
        });
    }
    
    // Copy All button functionality
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', function() {
            const allContent = Array.from(textareas)
                .map(textarea => textarea.value)
                .filter(value => value.trim() !== '')
                .join('\n\n');
                
            if (allContent) {
                copyToClipboard(allContent)
                    .then(() => showTooltip(this, '已复制全部内容'))
                    .catch(() => showTooltip(this, '复制失败'));
            } else {
                showTooltip(this, '没有内容可复制');
            }
        });
    }
    
    // Copy Markdown button functionality
    if (copyMarkdownBtn) {
        copyMarkdownBtn.addEventListener('click', function() {
            const markdown = generateMarkdown();
            if (markdown) {
                copyToClipboard(markdown)
                    .then(() => showTooltip(this, '已复制Markdown格式'))
                    .catch(() => showTooltip(this, '复制失败'));
            } else {
                showTooltip(this, '没有内容可复制');
            }
        });
    }
    
    // Close preview modal
    document.querySelector('.preview-close')?.addEventListener('click', function() {
        document.querySelector('.preview-modal').style.display = 'none';
    });
    
    // Close preview when clicking outside
    document.querySelector('.preview-modal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate markdown from textareas
function generateMarkdown() {
    const promptDetails = document.querySelector('.prompt-details');
    if (!promptDetails) return '';
    
    const promptValue = promptDetails.querySelector('.prompt-textarea')?.value.trim();
    const formatValue = promptDetails.querySelector('.format-textarea')?.value.trim();
    const exampleValue = promptDetails.querySelector('.example-textarea')?.value.trim();
    
    let markdown = '';
    
    if (promptValue) {
        markdown += '## 提示词\n\n```\n' + promptValue + '\n```\n\n';
    }
    
    if (formatValue) {
        markdown += '## 输出格式\n\n```\n' + formatValue + '\n```\n\n';
    }
    
    if (exampleValue) {
        markdown += '## 样例\n\n```\n' + exampleValue + '\n```';
    }
    
    return markdown.trim();
}

// Setup copy section buttons
function setupCopySectionButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy-section');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            let textarea;
            
            switch(section) {
                case 'html':
                    textarea = document.querySelector('.prompt-textarea');
                    break;
                case 'css':
                    textarea = document.querySelector('.format-textarea');
                    break;
                case 'js':
                    textarea = document.querySelector('.example-textarea');
                    break;
                default:
                    return;
            }
            
            if (textarea && textarea.value.trim() !== '') {
                copyToClipboard(textarea.value)
                    .then(() => showTooltip(this, '已复制'))
                    .catch(() => showTooltip(this, '复制失败'));
            } else {
                showTooltip(this, '没有内容可复制');
            }
        });
    });
}

// 添加文本框滚动优化函数
function setupTextareaScrolling() {
    const allTextareas = document.querySelectorAll('.content-textarea');
    
    allTextareas.forEach(textarea => {
        // 点击文本框时确保其可滚动
        textarea.addEventListener('click', function() {
            if (this.readOnly) {
                // 使滚动条可见以提示用户可以滚动
                this.classList.add('scrollable');
                
                // 2秒后隐藏滚动条提示
                setTimeout(() => {
                    this.classList.remove('scrollable');
                }, 2000);
            }
        });
        
        // 确保滚轮事件在文本框内正常工作（优化触控板支持）
        textarea.addEventListener('wheel', function(e) {
            if (this.readOnly) {
                // 获取当前滚动位置
                const isAtTop = this.scrollTop <= 0;
                const isAtBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;
                
                // 检查滚动方向和边界
                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    // 到达顶部继续向上滚动或到达底部继续向下滚动时才阻止
                    return; // 允许事件冒泡
                }
                
                // 阻止事件冒泡但允许默认滚动
                e.stopPropagation();
            }
        }, { passive: true });
    });
}
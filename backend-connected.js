// Backend Overrides - Will work alongside your existing HTML without modifications
document.addEventListener('DOMContentLoaded', function() {
    const API_BASE = 'http://localhost:5000';
    
    // ====== OVERRIDE BOOK FUNCTIONS ====== //
    // Replace sampleBooks with empty array
    window.sampleBooks = [];
    
    // Replace displayBooks with backend version
    window.displayBooks = async function() {
        try {
            const bookList = document.getElementById('bookList');
            bookList.innerHTML = '<div class="loading">Loading books...</div>';
            
            const response = await fetch(`${API_BASE}/api/books`);
            if (!response.ok) throw new Error('Failed to load books');
            const books = await response.json();
            
            bookList.innerHTML = '';
            books.forEach(book => {
                bookList.innerHTML += `
                    <div class="book-card glass-card">
                        <img src="${book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'}" 
                             class="book-cover">
                        <div class="book-details">
                            <h3 class="book-title">${book.title}</h3>
                            <p class="book-author">${book.author}</p>
                            <p class="book-rating">${'★'.repeat(book.rating || 0)}${'☆'.repeat(5 - (book.rating || 0))}</p>
                        </div>
                    </div>
                `;
            });
            
            // Update stats
            document.getElementById('totalBooks').textContent = books.length;
            const avgRating = books.reduce((sum, book) => sum + (book.rating || 0), 0) / books.length;
            document.getElementById('avgRating').textContent = avgRating.toFixed(1);
            
        } catch (error) {
            bookList.innerHTML = '<p class="error">Failed to load books</p>';
            console.error("Error:", error);
        }
    };

    // Replace form submission
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.removeEventListener('submit', window.addBookForm._originalSubmit); // Remove old listener if exists
        addBookForm._originalSubmit = addBookForm.onsubmit; // Backup original
        addBookForm.onsubmit = null;
        
        addBookForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = e.target.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

            const bookData = {
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('bookAuthor').value,
                description: document.getElementById('bookDescription').value || '',
                rating: parseInt(document.getElementById('bookRating').value) || 0,
                annotation: document.getElementById('favAnnotation').value || '',
                cover_url: '' // You'll implement file upload later
            };

            try {
                const response = await fetch(`${API_BASE}/api/books`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookData)
                });
                
                if (!response.ok) throw new Error('Failed to add book');
                
                await window.displayBooks(); // Refresh the list
                e.target.reset(); // Clear form
                
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to add book. Please try again.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Book';
            }
        });
    }

    // ====== OVERRIDE WRITING LOGS ====== //
    // Replace writingLogs with empty array
    window.writingLogs = [];
    
    // Replace displayWritingLogs with backend version
    window.displayWritingLogs = async function() {
        try {
            const writingLogsList = document.getElementById('writingLogsList');
            writingLogsList.innerHTML = '<div class="loading">Loading writing logs...</div>';
            
            const response = await fetch(`${API_BASE}/api/writing-logs`);
            if (!response.ok) throw new Error('Failed to load writing logs');
            const logs = await response.json();
            
            writingLogsList.innerHTML = '';
            
            if (logs.length === 0) {
                writingLogsList.innerHTML = '<p class="info">No writing logs found. Start writing to see your history here.</p>';
                return;
            }
            
            logs.forEach(log => {
                const logItem = document.createElement('div');
                logItem.className = 'log-item glass-card';
                logItem.innerHTML = `
                    <p class="log-date"><i class="fas fa-calendar"></i> ${new Date(log.created_at).toLocaleDateString()}</p>
                    <p class="log-content">${log.content}</p>
                    ${log.prompt ? `<p class="log-prompt"><i class="fas fa-quote-left"></i> Prompt: ${log.prompt}</p>` : ''}
                    <p class="word-count"><i class="fas fa-font"></i> ${log.word_count || 'N/A'} words</p>
                `;
                writingLogsList.appendChild(logItem);
            });
            
        } catch (error) {
            writingLogsList.innerHTML = '<p class="error">Failed to load writing logs</p>';
            console.error("Error:", error);
        }
    };

    // Initialize if on writer dashboard
    if (document.getElementById('writerDashboard')) {
        window.displayWritingLogs();
    }
});
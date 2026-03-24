(function () {
  const POSTS = [
    {
      href: '/blogs/upload-file-problem',
      title: 'Upload 10GB & Stream cho 1000 Users',
    },
    {
      href: '/blogs/pagination-problem',
      title: 'Paging 2 Triệu Dòng Dữ Liệu',
    },
    {
      href: '/blogs/overselling-problem',
      title: 'Overselling — Flash Sale & Race Condition',
    },
  ];

  function getCurrentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function render() {
    const current = getCurrentPage();

    const style = document.createElement('style');
    style.textContent = `
      #blog-sidebar {
        display: none;
      }

      @media (min-width: 1160px) {
        #blog-sidebar {
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 56px;
          width: 210px;
          height: calc(100vh - 56px);
          padding: 28px 16px 24px;
          border-right: 1px solid #e8e8e8;
          overflow-y: auto;
          background: #fff;
          z-index: 90;
          box-sizing: border-box;
        }
        .hero,
        article {
          margin-left: 230px !important;
          margin-right: auto !important;
        }
      }

      .sidebar-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.2px;
        text-transform: uppercase;
        color: #bbb;
        margin-bottom: 10px;
        padding-left: 10px;
      }

      .sidebar-posts {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }

      .sidebar-post-link {
        display: block;
        text-decoration: none;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 12.5px;
        line-height: 1.5;
        color: #888;
        border-left: 2px solid transparent;
        transition: color 0.12s, background 0.12s;
      }

      .sidebar-post-link:hover {
        background: #f5f5f5;
        color: #1a1a1a;
      }

      .sidebar-post-link.active {
        color: #1a1a1a;
        font-weight: 600;
        border-left-color: #1a1a1a;
        background: #f5f5f5;
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-color: #1a1a1a;
      }

      .sidebar-post-num {
        display: block;
        font-size: 10px;
        font-weight: 700;
        color: #ccc;
        margin-bottom: 2px;
        letter-spacing: 0.5px;
      }

      .sidebar-post-link.active .sidebar-post-num {
        color: #999;
      }
    `;
    document.head.appendChild(style);

    const sidebar = document.createElement('div');
    sidebar.id = 'blog-sidebar';

    const items = POSTS.map(function (post, i) {
      const isActive = current === post.href;
      return (
        '<li>' +
        '<a href="' + post.href + '" class="sidebar-post-link' + (isActive ? ' active' : '') + '">' +
        '<span class="sidebar-post-num">0' + (i + 1) + '</span>' +
        post.title +
        '</a>' +
        '</li>'
      );
    }).join('');

    sidebar.innerHTML =
      '<p class="sidebar-label">Bài viết</p>' +
      '<ul class="sidebar-posts">' + items + '</ul>';

    document.body.appendChild(sidebar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();

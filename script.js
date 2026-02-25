/* ===========================
   レンタルサーバー比較サイト
   共通スクリプト
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* === モバイルメニュー === */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // リンクをクリックしたら閉じる
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* === FAQ アコーディオン === */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  /* === 比較テーブル ソート === */
  const table = document.querySelector('.compare-table');
  if (table) {
    const headers = table.querySelectorAll('th.sortable');
    let sortState = { col: -1, asc: true };

    headers.forEach((th, idx) => {
      th.addEventListener('click', () => {
        const colIndex = parseInt(th.dataset.col || idx, 10);
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        const asc = sortState.col === colIndex ? !sortState.asc : true;
        sortState = { col: colIndex, asc };

        // ソートアイコン更新
        headers.forEach(h => {
          const icon = h.querySelector('.sort-icon');
          if (icon) icon.textContent = '⇅';
        });
        const icon = th.querySelector('.sort-icon');
        if (icon) icon.textContent = asc ? '↑' : '↓';

        rows.sort((a, b) => {
          const aCell = a.querySelectorAll('td')[colIndex];
          const bCell = b.querySelectorAll('td')[colIndex];
          if (!aCell || !bCell) return 0;

          const aText = aCell.dataset.sort || aCell.textContent.trim();
          const bText = bCell.dataset.sort || bCell.textContent.trim();

          const aNum = parseFloat(aText.replace(/[^0-9.]/g, ''));
          const bNum = parseFloat(bText.replace(/[^0-9.]/g, ''));

          if (!isNaN(aNum) && !isNaN(bNum)) {
            return asc ? aNum - bNum : bNum - aNum;
          }
          return asc ? aText.localeCompare(bText, 'ja') : bText.localeCompare(aText, 'ja');
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  /* === スコアバーアニメーション === */
  const bars = document.querySelectorAll('.score-bar-fill');
  if (bars.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0%';
          bar.style.width = width;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    bars.forEach(bar => {
      const target = bar.dataset.width || '0%';
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

  /* === スムーズスクロール（TOCリンク対応） === */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return; // CTAボタン等はスキップ
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // ヘッダー高さ
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* === 現在のナビリンクをアクティブに === */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.global-nav a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.split('/').pop() === currentPath) {
      a.classList.add('active');
    }
  });

  /* === スクロールアニメーション === */
  const fadeEls = document.querySelectorAll('.ranking-card, .category-card, .info-card');
  if (fadeEls.length > 0 && window.IntersectionObserver) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      fadeObserver.observe(el);
    });
  }

});

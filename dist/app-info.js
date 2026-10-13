/**
 * Universal App Branding & About Section Specification
 * Standard configuration object for all applications developed under Prometrion.
 */

const AppInfo = {
  APP_NAME: "Online clock",
  DESCRIPTION: "A precision digital clock with dark and light theme toggle across global timezones.",
  VERSION: "1.0.0",
  BUILD_NUMBER: "1",
  COMPANY_NAME: "Prometrion",
  COMPANY_URL: "https://www.prometrion.com/",
  DEVELOPER_NAME: "Rajnikant Gaurav",
  DEVELOPER_URL: "https://www.rajnikantg.in/",
  ICON_SRC: "public/clock-logo.png",

  get COPYRIGHT() {
    return `© ${new Date().getFullYear()} Prometrion. All rights reserved.`;
  },

  /**
   * Generates the standard attribution HTML
   * Primary attribution: A Product of Prometrion
   * Developer attribution: Built with 💻 & ☕. By Rajnikant Gaurav
   */
  getBrandingHTML() {
    return `
      <div class="prometrion-branding-block">
        <p class="brand-attribution">
          A Product of <a href="${this.COMPANY_URL}" target="_blank" rel="noopener noreferrer" class="prometrion-link"><img src="public/Prometrion%20logo2.png" alt="Prometrion Logo" class="prometrion-inline-logo" width="16" height="16"><strong>${this.COMPANY_NAME}</strong></a>
        </p>
        <p class="dev-attribution">
          Built with 💻 & ☕. By <a href="${this.DEVELOPER_URL}" target="_blank" rel="noopener noreferrer" class="prometrion-link"><strong>${this.DEVELOPER_NAME}</strong></a>
        </p>
      </div>
    `;
  },

  /**
   * Generates the structured About App screen contents according to the universal specification
   */
  getAboutDialogHTML() {
    return `
      <div class="about-card-surface">
        <div class="about-header">
          <span class="about-tag">ABOUT</span>
          <button type="button" class="about-close-btn" id="closeAboutBtn" aria-label="Close About dialog">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="about-identity">
          <div class="about-icon-wrapper">
            <img src="${this.ICON_SRC}" alt="${this.APP_NAME} Icon" class="about-icon-img" width="56" height="56">
          </div>
          <h2 class="about-app-name">${this.APP_NAME}</h2>
          <p class="about-app-desc">${this.DESCRIPTION}</p>
          <div class="about-version-badge">
            <span>Version ${this.VERSION}</span>
            <span class="version-sep">•</span>
            <span>Build ${this.BUILD_NUMBER}</span>
          </div>
        </div>

        <div class="about-divider"></div>

        <div class="about-attribution-section">
          <p class="about-product-of">
            A Product of <a href="${this.COMPANY_URL}" target="_blank" rel="noopener noreferrer" class="prometrion-link"><img src="public/Prometrion%20logo2.png" alt="Prometrion Logo" class="prometrion-inline-logo" width="16" height="16"><strong>${this.COMPANY_NAME}</strong></a>
          </p>
          <p class="about-built-by">
            Built with 💻 & ☕. By <a href="${this.DEVELOPER_URL}" target="_blank" rel="noopener noreferrer" class="prometrion-link"><strong>${this.DEVELOPER_NAME}</strong></a>
          </p>
          
          <div class="about-nav-links">
            <a href="${this.COMPANY_URL}" target="_blank" rel="noopener noreferrer" class="about-nav-link">
              <img src="public/Prometrion%20logo2.png" alt="Prometrion Logo" class="prometrion-inline-logo" width="14" height="14">
              <span>${this.COMPANY_NAME}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
            <a href="${this.DEVELOPER_URL}" target="_blank" rel="noopener noreferrer" class="about-nav-link">
              <span>${this.DEVELOPER_NAME}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
          </div>
        </div>

        <div class="about-divider"></div>

        <div class="about-copyright-section">
          <p class="about-company-sub">${this.COMPANY_NAME}</p>
          <p class="about-tagline">Software & Technology</p>
          <p class="about-copyright-text">${this.COPYRIGHT}</p>
        </div>
      </div>
    `;
  }
};

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.AppInfo = AppInfo;
}

// Module export for potential node/bundler usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppInfo;
}

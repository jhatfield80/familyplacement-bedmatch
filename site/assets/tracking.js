// UTM Parameter Pass-Through & CTA Tracking
(function() {
    'use strict';
    
    // Cookie Consent Management
    const CONSENT_KEY = 'bedmatch_consent';
    let consentGiven = false;
    
    function getConsent() {
        try {
            const stored = localStorage.getItem(CONSENT_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch(e) {
            return null;
        }
    }
    
    function setConsent(value) {
        try {
            localStorage.setItem(CONSENT_KEY, JSON.stringify({
                value: value,
                timestamp: Date.now()
            }));
            consentGiven = value;
        } catch(e) {
            // localStorage not available
        }
    }
    
    function showConsentBanner() {
        const banner = document.getElementById('consent-banner');
        if (!banner) return;
        
        const consent = getConsent();
        if (consent !== null) {
            consentGiven = consent.value;
            if (consentGiven) {
                loadGTM();
            }
            return;
        }
        
        // Show banner if no consent stored
        banner.hidden = false;
        
        document.getElementById('consent-accept').addEventListener('click', () => {
            setConsent(true);
            banner.hidden = true;
            loadGTM();
        });
        
        document.getElementById('consent-decline').addEventListener('click', () => {
            setConsent(false);
            banner.hidden = true;
        });
    }
    
    // Load Google Tag Manager (only after consent)
    function loadGTM() {
        if (window.dataLayer) return; // Already loaded
        
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
        });
        
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-W7TP6DT7';
        document.head.appendChild(script);
    }
    
    // UTM Parameter Handling
    function getURLParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content'),
            gclid: params.get('gclid'),
            fbclid: params.get('fbclid'),
            msclkid: params.get('msclkid')
        };
    }
    
    function buildTrackingParams(ctaName) {
        const params = getURLParams();
        const hasUTM = Object.values(params).some(v => v !== null);
        
        // If no UTM parameters in URL, add default attribution
        if (!hasUTM) {
            params.utm_source = 'familyplacement';
            params.utm_medium = 'landing_page';
            params.utm_campaign = 'family_placement';
            params.utm_content = ctaName || 'unknown';
        } else if (ctaName) {
            // Preserve existing UTMs but add content parameter if not set
            params.utm_content = params.utm_content || ctaName;
        }
        
        // Build query string from non-null values
        const query = Object.entries(params)
            .filter(([key, value]) => value !== null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        
        return query;
    }
    
    function appendTrackingToURL(url, ctaName) {
        const tracking = buildTrackingParams(ctaName);
        if (!tracking) return url;
        
        const separator = url.includes('?') ? '&' : '?';
        return url + separator + tracking;
    }
    
    // Track CTA Clicks
    function trackCTAClick(button) {
        const ctaName = button.getAttribute('data-cta-name') || 'unknown';
        const ctaText = button.textContent.trim();
        const linkUrl = button.href;
        
        // Push to dataLayer for GTM
        if (window.dataLayer && consentGiven) {
            window.dataLayer.push({
                event: 'cta_click',
                cta_name: ctaName,
                cta_text: ctaText,
                link_url: linkUrl
            });
        }
        
        // Append tracking parameters to signup links
        if (linkUrl && linkUrl.includes('app.bedmatch.health')) {
            button.href = appendTrackingToURL(linkUrl, ctaName);
        }
    }
    
    // Initialize Tracking
    function init() {
        // Show consent banner
        showConsentBanner();
        
        // Add tracking to all CTA buttons
        document.querySelectorAll('.cta-button, .header-cta').forEach(button => {
            button.addEventListener('click', function(e) {
                trackCTAClick(this);
            });
        });
        
        // Track all links to app.bedmatch.health
        document.querySelectorAll('a[href*="app.bedmatch.health"]').forEach(link => {
            // Add data-cta-name if not present
            if (!link.hasAttribute('data-cta-name')) {
                const section = link.closest('section');
                const ctaName = section ? section.className.split(' ')[0] : 'footer';
                link.setAttribute('data-cta-name', ctaName);
            }
            
            link.addEventListener('click', function(e) {
                trackCTAClick(this);
            });
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

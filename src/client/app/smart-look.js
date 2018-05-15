export function initSmartlook() {
    let smartlook;
    const d = document;
    var o = (smartlook = function() {
            o.api.push(arguments);
        }),
        h = d.getElementsByTagName('head')[0];
    var c = d.createElement('script');
    o.api = new Array();
    c.async = true;
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.src = 'https://rec.smartlook.com/recorder.js';
    h.appendChild(c);
    window.smartlook = smartlook;
    smartlook('init', process.env.SMARTLOOK_KEY);
}

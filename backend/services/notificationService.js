const db = require('../database/db');

function dispatchNotification({ recipientPhone, type, title, message, metadata = {} }) {
  const cleanPhone = recipientPhone ? recipientPhone.replace(/\D/g, '') : '';
  const isApiConfigured = !!process.env.WHATSAPP_CLOUD_API_TOKEN;

  const notification = {
    id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    recipientPhone: cleanPhone,
    type, // 'meeting_alert' | 'referral_received' | 'strike_warning' | 'welcome'
    title,
    message,
    metadata,
    channel: 'in_app_and_whatsapp',
    status: isApiConfigured ? 'api_dispatched' : 'demo_dispatched',
    createdAt: new Date().toISOString()
  };

  // Build WhatsApp Cloud API Payload Template
  let waPayload = null;
  if (type === 'speaker_alert') {
    waPayload = {
      messaging_product: "whatsapp",
      to: cleanPhone,
      type: "template",
      template: {
        name: "nbn_speaker_queue_cue",
        language: { code: "ta" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: metadata.speakerName || "வணிகர்" },
              { type: "text", text: metadata.businessName || "நிறுவனம்" },
              { type: "text", text: "2 நிமிடங்கள்" }
            ]
          }
        ]
      }
    };
  }

  notification.waPayload = waPayload;
  return notification;
}

module.exports = {
  dispatchNotification
};

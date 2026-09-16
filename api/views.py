import os
import urllib.request
import json
from rest_framework import generics
from .models import Project, Skill, ContactMessage
from .serializers import ProjectSerializer, SkillSerializer, ContactMessageSerializer
from rest_framework.throttling import AnonRateThrottle

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class SkillListView(generics.ListAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer

class ContactMessageCreateView(generics.CreateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    throttle_classes = [AnonRateThrottle]  # Prevent spam

    def perform_create(self, serializer):
        instance = serializer.save()
        # Forward to Telegram Bot if configured in environment
        tg_token = os.environ.get('TELEGRAM_BOT_TOKEN')
        tg_chat_id = os.environ.get('TELEGRAM_CHAT_ID')
        if tg_token and tg_chat_id:
            try:
                text = (
                    f"🚀 <b>Yangi xabar portfolio saytidan!</b>\n\n"
                    f"👤 <b>Ism:</b> {instance.name}\n"
                    f"📧 <b>Aloqa:</b> {instance.contact_info}\n\n"
                    f"💬 <b>Xabar:</b>\n{instance.message}"
                )
                url = f"https://api.telegram.org/bot{tg_token}/sendMessage"
                data = json.dumps({"chat_id": tg_chat_id, "text": text, "parse_mode": "HTML"}).encode('utf-8')
                req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
                urllib.request.urlopen(req, timeout=5)
            except Exception:
                pass


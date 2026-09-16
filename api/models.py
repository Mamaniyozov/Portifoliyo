from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    tech_stack = models.CharField(max_length=500, help_text="Texnologiyalarni vergul bilan ajratib yozing")
    link = models.URLField(blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['sort_order', '-created_at']

    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100, help_text="Masalan: Frontend, Backend, Database")
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['category', 'sort_order']

    def __str__(self):
        return f"{self.name} ({self.category})"

class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    contact_info = models.CharField(max_length=200, help_text="Email yoki Telegram username")
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Xabar: {self.name} dan"

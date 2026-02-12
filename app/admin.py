from django.contrib import admin

from .models import GetInTouch

# Register your models here.

@admin.register(GetInTouch)
class GetInTouchAdmin(admin.ModelAdmin):
    ...

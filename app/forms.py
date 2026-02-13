from django import forms
from .models import GetInTouch


class GetInTouchForm(forms.ModelForm):
    class Meta:
        model = GetInTouch
        fields = ('full_name', 'phone_number', 'email', 'message', 'drivers_license')
        widgets = {
            'full_name': forms.TextInput(attrs={'placeholder': 'John Doe'}),
            'phone_number': forms.TextInput(attrs={'placeholder': '(123) 456-7890'}),
            'email': forms.EmailInput(attrs={'placeholder': 'john@example.com'}),
            'message': forms.Textarea(attrs={'placeholder': 'Tell us about yourself...', 'rows': 4}),
        }
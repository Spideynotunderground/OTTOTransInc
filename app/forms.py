from django import forms
from django.core.validators import FileExtensionValidator
from .models import GetInTouch, ShipperRequest


class GetInTouchForm(forms.ModelForm):
    class Meta:
        model = GetInTouch
        fields = ('full_name', 'phone_number', 'email', 'message', 'drivers_license')
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Full Name',
                'class': 'form-input'
            }),
            'phone_number': forms.TextInput(attrs={
                'placeholder': '(555) 123-4567',
                'class': 'form-input',
                'type': 'tel'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Email address',
                'class': 'form-input'
            }),
            'message': forms.Textarea(attrs={
                'placeholder': 'Additional text...',
                'rows': 5,
                'class': 'form-textarea'
            }),
        }
        labels = {
            'drivers_license': '',
        }

    def clean_drivers_license(self):
        file = self.cleaned_data.get('drivers_license')
        
        if file:
            if file.size > 3 * 1024 * 1024:
                raise forms.ValidationError('File size must not exceed 3MB')
            
            allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
            if file.content_type not in allowed_types:
                raise forms.ValidationError('Only images (JPEG, PNG, WEBP) or PDF are allowed')
        
        return file

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        digits = ''.join(filter(str.isdigit, phone))
        
        if len(digits) != 10:
            raise forms.ValidationError(f'Phone number must be 10 digits (got {len(digits)})')
        
        return phone

    def clean_full_name(self):
        name = self.cleaned_data.get('full_name')
        if len(name) < 2:
            raise forms.ValidationError('Full Name must be at least 2 characters')
        return name


class ShipperRequestForm(forms.ModelForm):
    class Meta:
        model = ShipperRequest
        fields = (
            'company_name', 'full_name', 'phone_number', 'email',
            'origin_city_state', 'destination_city_state', 'frequency',
            'equipment_type', 'estimated_volume', 'additional_notes'
        )
        widgets = {
            'company_name': forms.TextInput(attrs={
                'placeholder': 'Company Name',
                'class': 'modal-input'
            }),
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Full Name',
                'class': 'modal-input'
            }),
            'phone_number': forms.TextInput(attrs={
                'placeholder': '(555) 123-4567',
                'class': 'modal-input',
                'type': 'tel'
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'Email address',
                'class': 'modal-input'
            }),
            'origin_city_state': forms.TextInput(attrs={
                'placeholder': 'Origin City/State',
                'class': 'modal-input'
            }),
            'destination_city_state': forms.TextInput(attrs={
                'placeholder': 'Destination City/State',
                'class': 'modal-input'
            }),
            'frequency': forms.TextInput(attrs={
                'placeholder': 'Frequency (Select date range)',
                'class': 'modal-input',
                'id': 'frequency-date-range',
                'readonly': 'readonly'
            }),
            'equipment_type': forms.Select(attrs={
                'class': 'modal-select'
            }),
            'estimated_volume': forms.TextInput(attrs={
                'placeholder': 'Estimated Volume',
                'class': 'modal-input'
            }),
            'additional_notes': forms.Textarea(attrs={
                'placeholder': 'Additional notes...',
                'rows': 4,
                'class': 'modal-textarea'
            }),
        }

    def clean_phone_number(self):
        phone = self.cleaned_data.get('phone_number')
        digits = ''.join(filter(str.isdigit, phone))
        
        if len(digits) != 10:
            raise forms.ValidationError(f'Phone number must be 10 digits (got {len(digits)})')
        
        return phone
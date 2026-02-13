from django.shortcuts import render, redirect
from django.core.mail import EmailMessage
from django.conf import settings
import mimetypes
from .forms import GetInTouchForm


def home(request):
    if request.method == 'POST':
        form = GetInTouchForm(request.POST, request.FILES)
        if form.is_valid():
            # Save to database
            contact = form.save()
            
            # Prepare email
            subject = f"New Contact Form Submission: {form.cleaned_data['full_name']}"
            
            email_body = f"""
New Contact Form Submission:

Name: {form.cleaned_data['full_name']}
Phone: {form.cleaned_data['phone_number']}
Email: {form.cleaned_data['email']}
Message: {form.cleaned_data['message']}
Driver's License: {'Uploaded (see attachment)' if contact.drivers_license else 'Not provided'}

Submitted at: {contact.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
            
            # Create email with attachment
            email = EmailMessage(
                subject=subject,
                body=email_body,
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER],  # Send to yourself
                reply_to=[form.cleaned_data['email']],
            )
            
            # Attach driver's license if provided
            if contact.drivers_license:
                # Use the saved file from the contact object
                file_path = contact.drivers_license.path
                mime_type, _ = mimetypes.guess_type(file_path)
                with open(file_path, 'rb') as f:
                    email.attach(contact.drivers_license.name, f.read(), mime_type or 'application/octet-stream')
            
            # Send email
            try:
                email.send(fail_silently=False)
            except Exception as e:
                print(f"Error sending email: {e}")
            
            return redirect('app:home')
    else:
        form = GetInTouchForm()
    
    return render(request, 'home.html', {'form': form})
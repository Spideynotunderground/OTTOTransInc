from django.shortcuts import render, redirect
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import mimetypes
from .forms import GetInTouchForm, ShipperRequestForm


def home(request):
    driver_form = GetInTouchForm()
    shipper_form = ShipperRequestForm()
    
    if request.method == 'POST':
        if 'driver_form' in request.POST:
            driver_form = GetInTouchForm(request.POST, request.FILES)
            if driver_form.is_valid():
                try:
                    contact = driver_form.save()
                    
                    subject = f"New Driver Application: {driver_form.cleaned_data['full_name']}"
                    email_body = f"""
New Driver Application Received:

Full Name: {driver_form.cleaned_data['full_name']}
Phone: {driver_form.cleaned_data['phone_number']}
Email: {driver_form.cleaned_data['email']}
Message: {driver_form.cleaned_data['message'] or 'No additional message'}
Driver's License: Uploaded (see attachment)

Submitted at: {contact.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
                    
                    email = EmailMessage(
                        subject=subject,
                        body=email_body,
                        from_email=settings.EMAIL_HOST_USER,
                        to=[settings.EMAIL_HOST_USER],
                        reply_to=[driver_form.cleaned_data['email']],
                    )
                    
                    if contact.drivers_license:
                        file_path = contact.drivers_license.path
                        mime_type, _ = mimetypes.guess_type(file_path)
                        with open(file_path, 'rb') as f:
                            email.attach(contact.drivers_license.name, f.read(), mime_type or 'application/octet-stream')
                    
                    email.send(fail_silently=False)
                    messages.success(request, 'WE HAVE RECEIVED YOUR REQUEST. WE WILL CONTACT YOU IN 24 HOURS')
                    return redirect('app:home')
                    
                except Exception as e:
                    print(f"Error sending driver email: {e}")
                    messages.error(request, 'An error occurred. Please try again.')
            else:
                if 'drivers_license' in driver_form.errors:
                    messages.error(request, driver_form.errors['drivers_license'][0])
                    
        elif 'shipper_form' in request.POST:
            shipper_form = ShipperRequestForm(request.POST)
            if shipper_form.is_valid():
                try:
                    shipper = shipper_form.save()
                    
                    subject = f"New Shipper/Broker Request: {shipper_form.cleaned_data['company_name']}"
                    email_body = f"""
New Shipper/Broker Request for Dedicated Lane:

CONTACT INFORMATION:
Company Name: {shipper_form.cleaned_data['company_name']}
Full Name: {shipper_form.cleaned_data['full_name']}
Phone: {shipper_form.cleaned_data['phone_number']}
Email: {shipper_form.cleaned_data['email']}

LANE DETAILS:
Origin: {shipper_form.cleaned_data['origin_city_state']}
Destination: {shipper_form.cleaned_data['destination_city_state']}
Frequency: {shipper_form.cleaned_data['frequency']}
Equipment Type: {shipper.get_equipment_type_display()}
Estimated Volume: {shipper_form.cleaned_data['estimated_volume']}

ADDITIONAL NOTES:
{shipper_form.cleaned_data['additional_notes'] or 'None provided'}

Submitted at: {shipper.created_at.strftime('%Y-%m-%d %H:%M:%S')}
"""
                    
                    email = EmailMessage(
                        subject=subject,
                        body=email_body,
                        from_email=settings.EMAIL_HOST_USER,
                        to=[settings.EMAIL_HOST_USER],
                        reply_to=[shipper_form.cleaned_data['email']],
                    )
                    
                    email.send(fail_silently=False)
                    
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return JsonResponse({'success': True, 'message': 'Request submitted successfully!'})
                    
                    messages.success(request, 'YOUR REQUEST HAS BEEN SUBMITTED. WE WILL CONTACT YOU SOON.')
                    return redirect('app:home')
                    
                except Exception as e:
                    print(f"Error sending shipper email: {e}")
                    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                        return JsonResponse({'success': False, 'message': 'An error occurred. Please try again.'})
                    messages.error(request, 'An error occurred. Please try again.')
            else:
                if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
                    errors = {field: errors[0] for field, errors in shipper_form.errors.items()}
                    return JsonResponse({'success': False, 'errors': errors})
    
    return render(request, 'home.html', {
        'driver_form': driver_form,
        'shipper_form': shipper_form
    })
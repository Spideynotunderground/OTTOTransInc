from django.shortcuts import render
from .forms import GetInTouchForm

# Create your views here.

def home(request):
    form = GetInTouchForm(request.POST)
    return render(request, 'home.html', {'form': form})


def form(request):
    if request.method == 'POST':
        form = GetInTouchForm(request.POST)
        if form.is_valid():
            form.save()

            return GetInTouchForm('app:home')
    else:
        form = GetInTouchForm()

    return render(request, 'home.html',{'form': form})
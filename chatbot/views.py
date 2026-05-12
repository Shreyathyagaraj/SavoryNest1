import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import google.generativeai as genai

@csrf_exempt
def chat(request):
    if request.method == 'POST':
        try:
            data = JsonResponse.loads(request.body)
            message = data.get('message')
            history = data.get('history', [])
            
            genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            chat_session = model.start_chat(history=[
                {"role": h['role'], "parts": [h['content']]} for h in history
            ])
            
            response = chat_session.send_message(message)
            return JsonResponse({'reply': response.text})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid method'}, status=400)

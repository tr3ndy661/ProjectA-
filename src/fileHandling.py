import google.generativeai as genai
from google.generativeai.types import File

# Configure your API key
genai.configure(api_key='AIzaSyBD74WICdmvxs4IbzOlWMR9Mfb4Mx6F22I')

def process_uploaded_file(file_path):
    # Supported file types include PDFs, images, text files, etc.
    model = genai.GenerativeModel('gemini-pro-vision')
    
    # Read the file
    with open(file_path, 'rb') as file:
        file_content = file.read()
    
    # Prepare the file for input
    image_parts = [
        {
            'mime_type': 'application/pdf',  # or appropriate mime type
            'data': file_content
        }
    ]
    
    # Generate response based on file content
    response = model.generate_content([
        "Analyze the contents of this document thoroughly.", 
        image_parts[0]
    ])
    
    return response.text
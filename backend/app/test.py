# import base64
#
# # Read the image and encode it to base64
# with open("C:/Users/besho/Downloads/ruby.jpg", "rb") as image_file:
#     base64_string = base64.b64encode(image_file.read()).decode("utf-8")
#
# # Add the MIME type prefix (adjust if it's not PNG)
# base64_data_url = f"data:image/png;base64,{base64_string}"
#
# # Write to a file
# with open("C:/Users/besho/Downloads/ruby_base64.txt", "w") as output_file:
#     output_file.write(base64_data_url)
#
# print("Base64 image saved to ruby_base64.txt")

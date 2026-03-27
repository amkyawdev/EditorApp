import os
import shutil

class FileManager:
    @staticmethod
    def read_file(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return str(e)

    @staticmethod
    def write_file(path, content):
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            return False

    @staticmethod
    def delete_file(path):
        try:
            if os.path.isfile(path):
                os.remove(path)
            elif os.path.isdir(path):
                shutil.rmtree(path)
            return True
        except Exception as e:
            return False

    @staticmethod
    def list_files(directory):
        files_list = []
        for root, dirs, files in os.walk(directory):
            for name in files:
                files_list.append(os.path.relpath(os.path.join(root, name), directory))
        return files_list

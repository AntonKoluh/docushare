import os
import django


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "sharednotes.settings")
django.setup()

from Docs.models import DocEntry, Collaborators
from django.contrib.auth.models import User

# Create new DocEntry
user = User.objects.get(id=2)
doc = DocEntry.objects.get(id=2)
# new_doc = DocEntry(owner=user, doc=2)
# new_doc.save()


#new collab
# collab = Collaborators(doc_entry=doc, collaborator=user)
# collab.save()
entries = DocEntry.get_user_docs(user)
print(entries)
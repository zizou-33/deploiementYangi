from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os


class Command(BaseCommand):
    help = 'Crée un superutilisateur initial si aucun n\'existe'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        # On vérifie s'il y a déjà un superutilisateur
        if not User.objects.filter(is_superuser=True).exists():
            # On récupère les infos depuis les variables d'environnement Render
            # Sinon on met des valeurs par défaut
            username = os.environ.get('SUPERUSER_USERNAME', 'admin')
            email = os.environ.get('SUPERUSER_EMAIL', 'admin@yangi.com')
            password = os.environ.get('SUPERUSER_PASSWORD', 'YangiAdmin2026!')

            try:
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(self.style.SUCCESS(
                    f'✅ Superutilisateur "{username}" créé avec succès !'
                ))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'❌ Erreur lors de la création : {e}'))
        else:
            self.stdout.write(self.style.WARNING('⚠️ Un superutilisateur existe déjà.'))
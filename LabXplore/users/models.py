from django.contrib.auth.models import User
from django.db import models

class SimulationHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mass = models.FloatField()
    force = models.FloatField()
    static_friction = models.FloatField()
    kinetic_friction = models.FloatField()
    acceleration = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mass} kg - {self.force} N - {self.timestamp}"

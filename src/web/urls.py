# -*- encoding: utf-8 -*-

from django.urls import path

from src.web import views

urlpatterns = [
    path('', views.index, name='home'),

    # Dungeon
    path('dungeon/locations/', views.locationViewer, name="locationViewer"),
    path('dungeon/locations/workbench/', views.locationWorkbench, name="locationsWorkbench"),
    path('dungeon/locations/workbench/<int:id>/', views.locationWorkbench, name="locationsWorkbenchEdit"),

    path('dungeon/parts/', views.partViewer, name="partViewer"),
    path('dungeon/parts/workbench/', views.parkWorkbench, name="partWorkbench"),
    path('dungeon/parts/workbench/<int:id>/', views.parkWorkbench, name="partWorkbenchEdit"),

    path('dungeon/enemies/', views.enemyViewer, name="enemyViewer"),
    path('dungeon/enemies/workbench/', views.enemyWorkbench, name="enemyWorkbench"),
    path('dungeon/enemies/workbench/<int:id>/', views.enemyWorkbench, name="enemyWorkbenchEdit"),

    path('dungeon/obstacles/', views.obstacleViewer, name="obstacleViewer"),
    path('dungeon/obstacles/workbench/', views.obstacleWorkbench, name="obstaclesWorkbench"),
    path('dungeon/obstacles/workbench/<int:id>/', views.obstacleWorkbench, name="obstacleWorkbenchEdit"),

    path('mechanics/actions/', views.actionViewer, name="actionViewer"),
    path('mechanics/actions/workbench/', views.actionWorkbench, name="actionWorkbench"),
    path('mechanics/actions/workbench/<int:id>/', views.actionWorkbench, name="actionWorkbenchEdit"),

    path('mechanics/effects/', views.effectViewer, name="effectViewer"),

    path('mechanics/items/', views.itemViewer, name="itemViewer"),
    path('mechanics/items/workbench/', views.itemWorkbench, name="itemsWorkbench"),
    path('mechanics/items/workbench/<int:id>/', views.itemWorkbench, name="itemsWorkbenchEdit"),

    path('mechanics/summons/', views.summonViewer, name="summonViewer"),
    # path('mechanics/summons/workbench/', views.summonWorkbench, name="summonWorkbench"),
    # path('mechanics/summons/workbench/<int:id>/', views.summonWorkbench, name="summonWorkbenchEdit"),

    path('character/classes/', views.classViewer, name="classViewer"),
    path('character/classes/workbench/', views.classWorkbench, name="classWorkbench"),
    path('character/classes/workbench/<int:id>/', views.classWorkbench, name="classWorkbenchEdit"),

    path('character/races/', views.raceViewer, name="raceViewer"),
    path('character/races/workbench/', views.raceWorkbench, name="raceWorkbench"),
    path('character/races/workbench/<int:id>/', views.raceWorkbench, name="raceWorkbenchEdit"),

    path('world/campaigns/', views.campaignViewer, name="campaignViewer"),
    path('world/campaigns/workbench/', views.campaignWorkbench, name="campaignWorkbench"),
    path('world/campaigns/workbench/<int:id>/', views.campaignWorkbench, name="campaignWorkbenchEdit"),

    path('world/stories/', views.storyViewer, name="storyViewer"),
    # path('world/stories/workbench/', views.storyWorkbench, name="storyWorkbench"),
    # path('world/stories/workbench/<int:id>/', views.storyWorkbench, name="storyWorkbenchEdit"),

    path('world/achievements/', views.achievementViewer, name="achievementViewer"),
    # path('world/achievements/workbench/', views.achievementWorkbench, name="achievementWorkbench"),
    # path('world/achievements/workbench/<int:id>/', views.achievementWorkbench, name="achievementWorkbenchEdit"),

    path('player-data/adventures/', views.adventureViewer, name="adventureViewer"),
    # path('player-data/adventures/workbench/', views.adventureWorkbench, name="adventureWorkbench"),
    # path('player-data/adventures/workbench/<int:id>/', views.adventureWorkbench, name="adventureWorkbenchEdit"),

    path('player-data/licenses/', views.licenseViewer, name="licenseViewer"),
    # path('player-data/licenses/workbench/', views.licenseWorkbench, name="licenseWorkbench"),
    # path('player-data/licenses/workbench/<int:id>/', views.licenseWorkbench, name="licenseWorkbenchEdit"),
]

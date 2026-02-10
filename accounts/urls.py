from django.urls import path
from . views import Loginview,SignUpView,LogoutView,UserListView,WhoAmI,UserProfile,MyProfile
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns=[
    path('login/',Loginview.as_view(),name='login'),
    path('signup/',SignUpView.as_view(),name='signup'),
    path('logout/',LogoutView.as_view(),name='logout'),
    path('userlist/',UserListView.as_view(),name='sample'),
    path('whoami/',WhoAmI.as_view(),name='whoami'),
    path('user_profile/<int:userid>/',UserProfile.as_view(),name='profile'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/',MyProfile.as_view()),
]
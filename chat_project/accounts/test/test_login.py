from rest_framework.test import APITestCase
from django.contrib.auth.models import User

from accounts.views import Loginview
from rest_framework import status
from django.urls import reverse

class LoginApiTest(APITestCase):
    def setUp(self):
        self.user=User.objects.create_user(
            username='sanjay',
            password='sanjay'
        )
        self.login_url=reverse('login')
        self.signup_url=reverse('signup')
        self.logout_url=reverse('logout')
        
        self.whoami_url=reverse('whoami')

    def test_login_success(self):
        data={
            'username':'sanjay',
            'password':'sanjay'
        }

        response=self.client.post(self.login_url,data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['message'],'login successfully')

    def test_login_failed(self):
        data={
            'username':"sanjay",
            'password':'wrong'

        }

        response=self.client.post(self.login_url,data)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['message'],'invalid credentials')
        

    def test_signup_success(self):
        data={
            'username':'sample_user',
            'email':'sampleemail@gmail.com',
            'password':'samplepassword',
            'confirm_password':'samplepassword'
        }

        response=self.client.post(self.signup_url,data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)

    def test_signup_failed(self):
        data={
            'username':'sample_user',
            'email':'sampleemail@gmail.com',
            'password':'samplepassword',
            'confirm_password':'differntpassword'
        }

        response=self.client.post(self.signup_url,data)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    
    def test_logout_success(self):
        login_response=self.client.post(self.login_url,{
            'username':'sanjay',
            'password':'sanjay'
        })
        refresh_token=login_response.data['refresh']
        response=self.client.post(self.logout_url,{
            'refresh':refresh_token
        })
        self.assertEqual(response.status_code,status.HTTP_205_RESET_CONTENT)
    




    def test_whoami(self):
        login=self.client.post(self.login_url,{
            'username':'sanjay',
            'password':'sanjay'
        })

        access_token=login.data['access']

        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {access_token}'
        )
        respose=self.client.get(self.whoami_url)
        self.assertEqual(respose.data['username'],'sanjay')

    
    
    
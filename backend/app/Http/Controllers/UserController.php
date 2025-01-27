<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Hash;
use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    // register
    public function register(Request $request)
    {
        //validate
        $validator = Validator::make($request->all(), [
            "name" => "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "password" => "required|string|max:12|min:8"
        ]);

        if ($validator->fails()) {
            return response()->json(['erros' => $validator->erros(), 422]);
        }

        // create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'user registered',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    //login
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required|max:12|min:8"
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'invalid email',
            ], 401);
        } elseif (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'incorrect password',
            ], 401);

        }

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'Login success',
            'user' => $user->makeHidden(['password']),
            'token' => $token
        ], 201);
    }

    //logout
    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return response()->json(['error' => 'token not provided'], 401);
            }
            JWTAuth::checkOrFail();
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'log out success'], 200);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'failed to logout'], 401);
        }


    }

    public function dashboard(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token Invalid'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        }

        return response()->json([
            'message' => 'login success, welcome to dashboard',
            "user" => $user,
        ]);

    }
}

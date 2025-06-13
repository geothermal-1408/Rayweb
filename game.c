#include <raylib.h>
float floorf(float);
float fabsf(float);
float fmaxf(float,float);
float sqrtf(float);
float atan2f(float,float);
float fminf(float,float);
float cosf(float);
float sinf(float);
double tan(double);
float acosf(float);
float asinf(float);
#include <raymath.h>

#define WIDTH 800
#define HEIGTH 600
#define BALL_RADIUS 100.0

static Vector2 ball_position = {0};
static Vector2 ball_velocity = {100,100};

void game_init()
{
  InitWindow(WIDTH, HEIGTH, "raylib wasm");
  SetTargetFPS(60);

  int w = GetScreenWidth();
  int h = GetScreenHeight();
  ball_position.x = w/2;
  ball_position.y = h/2;
  
}

void game_frame()
{
    BeginDrawing();
    ClearBackground((Color){20,20,20,255});
    float dt = GetFrameTime();
    float x = ball_position.x + (ball_velocity.x * dt);
    float y = ball_position.y + (ball_velocity.y * dt);
    if(x - BALL_RADIUS < 0.0 || x + BALL_RADIUS > GetScreenWidth()) {
      ball_velocity.x *= -1.0f;
    } else {
      ball_position.x = x;
    }
    if(y - BALL_RADIUS < 0.0 || y + BALL_RADIUS > GetScreenHeight()) {
      ball_velocity.y *= -1.0f;
    } else {
      ball_position.y = y;
    }

    DrawCircleV(ball_position, BALL_RADIUS, RED);
    EndDrawing();
}

void game_close()
{
  CloseWindow();
}

#ifndef PLATFORM_WEB
#define PLATFORM_WEB

int main(void)
{
  game_init();
  while(!WindowShouldClose()){
    game_frame();
  }
  game_close();
  return 0;
}

#endif //PLATFORM_WEB

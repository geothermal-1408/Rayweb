wasm: game.c
	$(WASI_PATH)/bin/clang -O3 --target=wasm32 \
		-I ./include \
		-nostdlib \
		-Wl,--no-entry \
		-Wl,--export-all \
		-Wl,--allow-undefined \
		-Wl,--export=game_init \
		-Wl,--export=game_frame \
		-Wl,--export=game_end \
		-o game.wasm \
		game.c \
		-DPLATFORM_WEB

native: game.c
	clang \
	-I../thirdParty/raylib/src \
	-L../thirdParty/raylib/src \
	-o game game.c \
	-lraylib -framework OpenGL -framework Cocoa -framework IOKit -framework CoreVideo

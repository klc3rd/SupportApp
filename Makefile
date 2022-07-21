build:
	npm run build
	cp -R ./.next/standalone ./
	mv ./standalone ./build
	cp -R ./public ./build/
	cp -R ./.next/static ./build/.next/

clean:
	rm -rf build
(function ($) {
	$.fn.cube = function (settings) {
		settings = settings || {};
		var $this = this;
		var length, width, height, brickCenter, lightVector, cubeColor, alpha, saturation, minLum, maxLum, lumFactor, frameRate, secondsPerRotation, xInit, yInit, xRate, yRate, cubeDiv, front, back, left, right, bottom, top, animating, ivl, num;

		function or(l, r) {
			return typeof l !== "undefined" ? l : r;
		}

		var positions = {
			front: [0, 0],
			left: [-1, 0],
			right: [1, 0],
			back: [2, 0],
			top: [0, 1],
			bottom: [0, -1]
		};

		function applySettings(settings) {
			length = settings.length || length || 400;
			width = settings.width || width || 400;
			height = settings.height || height || 400;
			brickCenter = settings.center || brickCenter || [300, 300];

			lightVector = settings.lightDirection ? [[settings.lightDirection[0]], [settings.lightDirection[1]], [settings.lightDirection[2]]] : lightVector || [[1], [1], [1]];
			cubeColor = or(settings.hue, or(cubeColor, 128));
			alpha = or(settings.opacity, (or(alpha, 1) * 100)) / 100;
			saturation = or(settings.saturation, or(saturation, 50));
			minLum = or(settings.minLuminosity, or(minLum, 50));
			maxLum = settings.maxLuminosity || maxLum || 85;
			if (maxLum < minLum) maxLum = minLum;
			lumFactor = maxLum - minLum;

			frameRate = 1000 / (settings.frameRate || (1000 / frameRate) || 20);
			secondsPerRotation = settings.secondsPerRotation || secondsPerRotation || 5;

			xInit = (settings.initialPosition ? settings.initialPosition[0] : (xInit / (Math.PI * 2)) || 0) * Math.PI / 2;
			yInit = (settings.initialPosition ? settings.initialPosition[1] : (yInit / (Math.PI * 2)) || 0) * Math.PI / 2;
			xRate = or(settings.horizontalCoefficient, or(xRate, 1));
			yRate = or(settings.verticalCoeficcient, or(yRate, 1));

			cubeDiv = settings.element ? $(settings.element) : $this;
			front = cubeDiv.find(".front");
			back = cubeDiv.find(".back");
			left = cubeDiv.find(".left");
			right = cubeDiv.find(".right");
			bottom = cubeDiv.find(".bottom");
			top = cubeDiv.find(".top");
			animating = settings.hasOwnProperty("animate") ? settings.animate : or(animating, true);
			num = num || 0;
			var n = num;
			draw();
			num = n;
			if (animating) {
				clearInterval(ivl);
				ivl = setInterval(draw, frameRate);
			}
		}
		applySettings(settings);

		function increment() {
			return 4 * Math.PI / (frameRate * secondsPerRotation);
		};

		function stopAnimation() {
			clearInterval(ivl);
			animating = false;
			return $this;
		}

		function startAnimation() {
			clearInterval(ivl);
			ivl = setInterval(draw, frameRate);
			animating = true;
			return $this;
		};

		function setPosition(coords) {
			if (positions[coords]) coords = positions[coords];
			xInit = coords[0] * Math.PI / 2;
			yInit = coords[1] * Math.PI / 2;
			num = 0;
			draw();
		}

		function movePosition(coords, time, fps) {
			fps = fps || frameRate;
			time = time !== false ? 1 : false;
			var restart = animating, n = num;
			stopAnimation();
			var iterations = time * fps, timeout = 1000 / fps;
			if (!time) iterations = 1;
			var init = [xInit, yInit];
			var xStep = coords[0] * Math.PI / 2 / iterations, yStep = coords[1] * Math.PI / 2 / iterations;
			(function move(i) {
				if (i < iterations) {
					xInit += xStep;
					yInit += yStep;
					draw();
					num = n;
					setTimeout(function () { move(i + 1); }, timeout);
					return;
				}
				if (restart) startAnimation();
			})(0);
			return $this;
		};

		function moveHorizontally(n, time, fps) {
			movePosition([-n, 0], time, fps);
		}

		function moveVertically(n, time, fps) {
			movePosition([0, -n], time, fps);
		}

		function draw() {
			var qy = xInit + xRate * (num % (2 * Math.PI));
			var qx = yInit + yRate * (num % (2 * Math.PI));
			if (animating) num += increment();
			var rotationMatrix = rotationMatrixCalc(qx, qy);
			var baseReferanceFrameX = [[1], [0], [0]],
            baseReferanceFrameY = [[0], [1], [0]],
            baseReferanceFrameZ = [[0], [0], [1]];

			//---Cube---
			drawRectangularSurface(front, brickCenter, [[0], [0], [length / 2]], height, width, [[1], [0], [0]], [[0], [1], [0]], qx, qy, cubeColor, lightVector);
			drawRectangularSurface(right, brickCenter, [[width / 2], [0], [0]], height, length, [[0], [0], [-1]], [[0], [1], [0]], qx, qy, cubeColor, lightVector);
			drawRectangularSurface(top, brickCenter, [[0], [height / 2], [0]], length, width, [[1], [0], [0]], [[0], [0], [-1]], qx, qy, cubeColor, lightVector);
			drawRectangularSurface(back, brickCenter, [[0], [0], [-length / 2]], height, width, [[-1], [0], [0]], [[0], [1], [0]], qx, qy, cubeColor, lightVector);
			drawRectangularSurface(left, brickCenter, [[-width / 2], [0], [0]], height, length, [[0], [0], [1]], [[0], [1], [0]], qx, qy, cubeColor, lightVector);
			drawRectangularSurface(bottom, brickCenter, [[0], [-height / 2], [0]], length, width, [[1], [0], [0]], [[0], [0], [1]], qx, qy, cubeColor, lightVector);

			function drawRectangularSurface(surface, rotationPoint2D, centerPoint3D, height, width, directionX, directionY, viewAngleX, viewAngleY, surfColor, lightVector) {
				var rotationMatrix = rotationMatrixCalc(viewAngleX, viewAngleY);
				directionX = matrixMultiply(rotationMatrix, vectorNorm(directionX));
				directionY = matrixMultiply(rotationMatrix, vectorNorm(directionY));
				directionZ = vectorCross3D(directionX, directionY);
				var baseReferanceFrameX = [[1], [0], [0]],
                baseReferanceFrameY = [[0], [1], [0]],
                baseReferanceFrameZ = [[0], [0], [1]];
				surfaceMatrix = [[vectorDot(baseReferanceFrameX, directionX), vectorDot(baseReferanceFrameX, directionY), vectorDot(baseReferanceFrameX, directionZ)],
                                                                                        [vectorDot(baseReferanceFrameY, directionX), vectorDot(baseReferanceFrameY, directionY), vectorDot(baseReferanceFrameY, directionZ)],
                                                                                        [vectorDot(baseReferanceFrameZ, directionX), vectorDot(baseReferanceFrameZ, directionY), vectorDot(baseReferanceFrameZ, directionZ)]];
				centerPoint3D = matrixMultiply(rotationMatrix, centerPoint3D);
				var lightAngle = minLum + lumFactor * vectorDot(vectorNorm(lightVector), vectorNorm(directionZ));
				var placementX, placementY;
				if (directionZ[2][0] > 0) {
					placementX = rotationPoint2D[0] + centerPoint3D[0][0] - width / 2;
					placementY = rotationPoint2D[1] - centerPoint3D[1][0] - height / 2;
					surface.attr("style", "height: " + height + "px; width: " + width + "px;" + "background-color: hsla(" + surfColor + "," + saturation + "%," + lightAngle + "%," + alpha + ");" + "-webkit-transform: matrix(" + roundTo(surfaceMatrix[0][0], 5) + "," + (-roundTo(surfaceMatrix[1][0], 5)) + "," + (-roundTo(surfaceMatrix[0][1], 5)) + "," + roundTo(surfaceMatrix[1][1], 5) + ",0,0);" + "-moz-transform: matrix(" + roundTo(surfaceMatrix[0][0], 5) + "," + (-roundTo(surfaceMatrix[1][0], 5)) + "," + (-roundTo(surfaceMatrix[0][1], 5)) + "," + roundTo(surfaceMatrix[1][1], 5) + ",0,0);" + "-ms-transform: matrix(" + roundTo(surfaceMatrix[0][0], 5) + "," + (-roundTo(surfaceMatrix[1][0], 5)) + "," + (-roundTo(surfaceMatrix[0][1], 5)) + "," + roundTo(surfaceMatrix[1][1], 5) + ",0,0);" + "-o-transform: matrix(" + roundTo(surfaceMatrix[0][0], 5) + "," + (-roundTo(surfaceMatrix[1][0], 5)) + "," + (-roundTo(surfaceMatrix[0][1], 5)) + "," + roundTo(surfaceMatrix[1][1], 5) + ",0,0);" + "position: absolute; left: " + placementX + "px; top: " + placementY + "px;");
				}
				else {
					surface.css({ "position": "absolute", "left": "-9999px" });
				}
			}

			function rotationMatrixCalc(qx, qy) {
				var A = [[1, 0, 0], [0, Math.cos(qx), -Math.sin(qx)], [0, Math.sin(qx), Math.cos(qx)]];
				var B = [[Math.cos(qy), 0, -Math.sin(qy)], [0, 1, 0], [Math.sin(qy), 0, Math.cos(qy)]];
				var rotationMatrix = matrixMultiply(A, B);
				return rotationMatrix;
			}

			function matrixMultiply(A, B) {
				var C = new Array(A.length);
				for (var i = 0; i < A.length; i++) {
					C[i] = new Array(B[0].length);
					for (var j = 0; j < B[0].length; j++) {
						C[i][j] = 0;
						for (var k = 0; k < B.length; k++) {
							C[i][j] += A[i][k] * B[k][j];
						}
					}
				}
				return C;
			}

			function vectorDot(A, B) {
				var C = 0;
				for (var i = 0; i < A.length; i++) {
					C += A[i][0] * B[i][0];
				}
				return C;
			}

			function vectorNorm(A) {
				magnitude = 0;
				var C = new Array(A.length);
				for (var i = 0; i < A.length; i++) {
					magnitude += A[i][0] * A[i][0];
				}
				magnitude = Math.sqrt(magnitude);
				for (i = 0; i < A.length; i++) {
					C[i] = new Array(1);
					C[i][0] = A[i][0] / magnitude;
				}
				return C;
			}

			function vectorCross3D(A, B) {
				var C = new Array(3);
				C[0] = new Array(1);
				C[0][0] = A[1][0] * B[2][0] - A[2][0] * B[1][0];
				C[1] = new Array(1);
				C[1][0] = A[2][0] * B[0][0] - A[0][0] * B[2][0];
				C[2] = new Array(1);
				C[2][0] = A[0][0] * B[1][0] - A[1][0] * B[0][0];
				return C;
			}

			function roundTo(number, numberOfDecimalPlaces) {
				var roundedNumber = Math.round(number * Math.pow(10, numberOfDecimalPlaces)) / Math.pow(10, numberOfDecimalPlaces);
				return roundedNumber;
			}
		}

		this.setOption = function (prop, value) {
			settings[prop] = value;
			applySettings(settings);
			return $this;
		};

		this.startAnimation = startAnimation;
		this.stopAnimation = stopAnimation;

		this.move = movePosition;
		this.moveRight = moveHorizontally;
		this.moveLeft = function (a, b, c) { return moveHorizontally(-a, b, c); };
		this.moveUp = moveVertically;
		this.moveDown = function (a, b, c) { return moveVertically(-a, b, c); };

		this.setPosition = setPosition;

		return this;
	};
})(jQuery);
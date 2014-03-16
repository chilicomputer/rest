/*
 * Copyright 2014 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author Scott Andrews
 */

(function (define) {
	'use strict';

	define(function (require) {

		var Promise = require('when/lib/Promise'),
			when = require('when'),
			normalizeHeaderName = require('./normalizeHeaderName');

		function defaultResolve(arg) { return arg; }
		function defaultReject(arg) { return when.reject(arg); }

		// extend ResponsePromise from Promise
		function ResponsePromise() {
			return Promise.apply(this, arguments);
		}
		ResponsePromise.prototype = Object.create(Promise.prototype);

		// augment ResponsePromise with HTTP Response specific methods

		/**
		 * Obtain the response entity
		 *
		 * @param {Function} [onFulfilled] callback to receive the entity on promise fulfillment
		 * @param {Function} [onRejected] callback to receive the entity on promise rejection
		 * @returns {Promise} for the response entity
		 */
		ResponsePromise.prototype.entity = function entity(onFulfilled, onRejected) {
			onFulfilled = onFulfilled || defaultResolve;
			onRejected = onRejected || defaultReject;

			return this.then(
				function (response) {
					return onFulfilled(response && response.entity);
				},
				function (response) {
					return onRejected(response && response.entity);
				}
			);
		};

		/**
		 * Obtain the response status
		 *
		 * @param {Function} [onFulfilled] callback to receive the status on promise fulfillment
		 * @param {Function} [onRejected] callback to receive the status on promise rejection
		 * @returns {Promise} for the response status
		 */
		ResponsePromise.prototype.status = function status(onFulfilled, onRejected) {
			onFulfilled = onFulfilled || defaultResolve;
			onRejected = onRejected || defaultReject;

			return this.then(
				function (response) {
					return onFulfilled(response && response.status && response.status.code);
				},
				function (response) {
					return onRejected(response && response.status && response.status.code);
				}
			);
		};

		/**
		 * Obtain the response headers map
		 *
		 * @param {Function} [onFulfilled] callback to receive the headers map on promise fulfillment
		 * @param {Function} [onRejected] callback to receive the headers map on promise rejection
		 * @returns {Promise} for the response headers map
		 */
		ResponsePromise.prototype.headers = function headers(onFulfilled, onRejected) {
			onFulfilled = onFulfilled || defaultResolve;
			onRejected = onRejected || defaultReject;

			return this.then(
				function (response) {
					return onFulfilled(response && response.headers);
				},
				function (response) {
					return onRejected(response && response.headers);
				}
			);
		};

		/**
		 * Obtain a specific response header
		 *
		 * @param {String} headerName the header to retrieve
		 * @param {Function} [onFulfilled] callback to receive the header value on promise fulfillment
		 * @param {Function} [onRejected] callback to receive the header value on promise rejection
		 * @returns {Promise} for the response header's value
		 */
		ResponsePromise.prototype.header = function header(headerName, onFulfilled, onRejected) {
			headerName = normalizeHeaderName(headerName);
			onFulfilled = onFulfilled || defaultResolve;
			onRejected = onRejected || defaultReject;

			return this.then(
				function (response) {
					return onFulfilled(response && response.headers && response.headers[headerName]);
				},
				function (response) {
					return onRejected(response && response.headers && response.headers[headerName]);
				}
			);
		};

		/**
		 * Wrap a Promise as an ResponsePromise
		 *
		 * @param {Promise<Response>} promise the promise for an HTTP Response
		 * @returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods
		 */
		function makeResponsePromise(promise) {
			return new ResponsePromise(promise.then.bind(promise));
		}

		makeResponsePromise.ResponsePromise = ResponsePromise;

		return makeResponsePromise;

	});

}(
	typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }
	// Boilerplate for AMD and Node
));

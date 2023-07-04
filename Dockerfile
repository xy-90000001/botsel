FROM python:3.10
WORKDIR /botsel
COPY requirements.txt /botsel/
RUN pip install -r requirements.txt
COPY . /botsel
CMD python botsel.py